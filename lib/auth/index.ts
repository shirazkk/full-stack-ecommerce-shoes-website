import { createClient } from '@/lib/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, fullName, phone }: SignUpData) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  // Create profile in profiles table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        phone,
        role: 'user',
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return { user: null, error: 'Failed to create user profile.' };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: 'user',
        full_name: fullName,
        phone,
      },
      error: null,
    };
  }

  return { user: null, error: 'Sign up failed unexpectedly.' };
}

/**
 * Sign in with email and password
 */
export async function signIn({ email, password }: SignInData) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (data.user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url, phone')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: profile?.role || 'user',
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url,
        phone: profile?.phone,
      },
      error: null,
    };
  }

  return { user: null, error: 'Sign in failed unexpectedly.' };
}

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new AuthError(error.message, error.status);
  }

  return { error };
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?update=true`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Get current session (client-side)
 */
export async function getSession() {
  const supabase = createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    return { session: null, error: error.message };
  }

  return { session, error: null };
}

/**
 * Get current user with profile (server-side)
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    role: profile.role,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    phone: profile.phone,
  };
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

/**
 * Check if user is admin (server-side)
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === 'admin';
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/auth/login') {
  const isAuth = await isAuthenticated();
  
  if (!isAuth) {
    redirect(redirectTo);
  }
}

/**
 * Require admin role - redirect to home if not admin
 */
export async function requireAdmin(redirectTo: string = '/') {
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    redirect(redirectTo);
  }
}