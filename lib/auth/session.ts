import { cookies } from 'next/headers';
import { createClient } from '../supabase/server';
import { Profile } from '@/types';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authToken)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      user: {
        id: data.id,
        email: data.email,
        role: data.role as 'user' | 'admin',
        profile: data as Profile,
      },
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return session;
}
