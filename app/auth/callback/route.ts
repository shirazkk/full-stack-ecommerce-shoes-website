import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth_failed`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_failed`);
      }

      // Check if user exists and create profile if needed
      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        // Create profile for new OAuth users
        if (!existingProfile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
              avatar_url: data.user.user_metadata?.avatar_url,
              role: 'user',
            });

          if (profileError) {
            console.error('Error creating profile for OAuth user:', profileError);
            // Don't redirect to error page, let user continue
          }
        }
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_failed`);
    }
  }

  // Redirect to home page after successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/`);
}
