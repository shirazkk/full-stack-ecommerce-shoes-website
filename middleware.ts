import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Skip middleware for auth callback route
  if (pathname === '/auth/callback') {
    return supabaseResponse;
  }

  // Auth routes - redirect authenticated users (except callback)
  const authRoutes = ['/login', '/signup', '/reset-password'];
  if (authRoutes.includes(pathname)) {
    if (user) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Protected routes - require authentication
  const protectedRoutes = ['/account', '/checkout', '/wishlist'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    if (!user) {
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
