import bcrypt from 'bcryptjs';
import { supabase } from '../supabase/client';
import { Profile, User } from '@/types';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(
  email: string,
  password: string,
  fullName?: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const hashedPassword = await hashPassword(password);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      return { user: null, error: authError?.message || 'Failed to create user' };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'user',
      })
      .select()
      .single();

    if (profileError) {
      return { user: null, error: profileError.message };
    }

    return {
      user: {
        id: authData.user.id,
        email,
        password: hashedPassword,
        profile: profileData as Profile,
      },
      error: null,
    };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return { user: null, error: 'Invalid credentials' };
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      return { user: null, error: profileError.message };
    }

    return {
      user: {
        id: authData.user.id,
        email,
        password: '',
        profile: profileData as Profile,
      },
      error: null,
    };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export async function getUserByEmail(
  email: string
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      password: '',
      profile: data as Profile,
    };
  } catch (error) {
    return null;
  }
}
