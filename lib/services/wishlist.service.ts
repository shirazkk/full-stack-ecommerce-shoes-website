import { createClient } from '@/lib/supabase/client';
import { Wishlist, Product } from '@/types';

export async function getWishlist(userId: string): Promise<Wishlist[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      product:products (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }

  return data as Wishlist[];
}

export async function addToWishlist(userId: string, productId: string): Promise<Wishlist | null> {
  const supabase = await createClient();

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return existing as Wishlist;
  }

  const { data, error } = await supabase
    .from('wishlist')
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select(`
      *,
      product:products (*)
    `)
    .single();

  if (error) {
    console.error('Error adding to wishlist:', error);
    return null;
  }

  return data as Wishlist;
}

export async function removeFromWishlist(wishlistId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('id', wishlistId);

  if (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }

  return true;
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  return !!data;
}

// Client-side wishlist functions for localStorage (for guest users)
export function getGuestWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const wishlist = localStorage.getItem('guest_wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
}

export function saveGuestWishlist(productIds: string[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('guest_wishlist', JSON.stringify(productIds));
  } catch (error) {
    console.error('Error saving guest wishlist:', error);
  }
}

export function addToGuestWishlist(productId: string): string[] {
  const wishlist = getGuestWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveGuestWishlist(wishlist);
  }
  return wishlist;
}

export function removeFromGuestWishlist(productId: string): string[] {
  const wishlist = getGuestWishlist().filter(id => id !== productId);
  saveGuestWishlist(wishlist);
  return wishlist;
}

export function isInGuestWishlist(productId: string): boolean {
  return getGuestWishlist().includes(productId);
}