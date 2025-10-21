import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { z } from 'zod';
import { cookies } from 'next/headers';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signinSchema.parse(body);

    const { user, error } = await authenticateUser(
      validatedData.email,
      validatedData.password
    );

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const cookieStore = cookies();
    cookieStore.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.profile?.role || 'user',
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
