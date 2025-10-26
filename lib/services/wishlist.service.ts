import { createClient } from '@/lib/supabase/client';
import { Wishlist, Product } from '@/types';

export async function getWishlist(userId: string): Promise<Wishlist[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wishlists')
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
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return existing as Wishlist;
  }

  const { data, error } = await supabase
    .from('wishlists')
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
    .from('wishlists')
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
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  return !!data;
}
