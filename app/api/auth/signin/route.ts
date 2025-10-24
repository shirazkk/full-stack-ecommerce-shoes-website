import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signinSchema.parse(body);

    const data = await authenticateUser(
      validatedData.email,
      validatedData.password
    );

    if (!data.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get user profile
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url, phone')
      .eq('id', data.user.id)
      .single();

    return NextResponse.json(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'user',
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
          phone: profile?.phone,
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
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
