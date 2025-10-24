import { createClient } from '@/lib/supabase/server';

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

/**
 * Get current user with profile (server-side)
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url, phone')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    role: profile?.role || 'user',
    full_name: profile?.full_name,
    avatar_url: profile?.avatar_url,
    phone: profile?.phone,
  };
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === 'admin';
}

/**
 * Create user profile (for API routes)
 */
export async function createUser(userData: {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
}) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      role: 'user',
    });

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  return { success: true };
}

/**
 * Authenticate user (for API routes)
 */
export async function authenticateUser(email: string, password: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }

  return data;
}
