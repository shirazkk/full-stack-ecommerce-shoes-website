import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    const supabase = await createClient();
    
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 400 }
      );
    }

    // Check if user needs email confirmation
    if (authData.user.email_confirmed_at) {
      // User is confirmed, create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: validatedData.fullName,
          role: 'user',
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            role: 'user',
            full_name: validatedData.fullName,
          },
        },
        { status: 201 }
      );
    } else {
      // User needs email confirmation
      return NextResponse.json(
        {
          message: 'Please check your email to confirm your account',
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            email_confirmed: false,
          },
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
