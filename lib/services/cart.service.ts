import { createClient } from '@/lib/supabase/client';
import { Cart, CartItem, Product } from '@/types';

export async function getCart(userId?: string, sessionId?: string): Promise<Cart | null> {
  const supabase = await createClient();
  
  let query = supabase.from('carts').select(`
    *,
    cart_items (
      *,
      product:products (*)
    )
  `);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (sessionId) {
    query = query.eq('session_id', sessionId);
  } else {
    return null;
  }

  const { data, error } = await query.single();

  if (error) {
    console.error('Error fetching cart:', error);
    return null;
  }

  return data as Cart;
}

export async function createCart(userId?: string, sessionId?: string): Promise<Cart | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('carts')
    .insert({
      user_id: userId,
      session_id: sessionId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating cart:', error);
    return null;
  }

  return data as Cart;
}

export async function addToCart(
  cartId: string,
  productId: string,
  size: string,
  color: string,
  quantity: number = 1
): Promise<CartItem | null> {
  const supabase = await createClient();

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .eq('size', size)
    .eq('color', color)
    .single();

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cart item:', error);
      return null;
    }

    return data as CartItem;
  } else {
    // Create new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cartId,
        product_id: productId,
        size,
        color,
        quantity,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return null;
    }

    return data as CartItem;
  }
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<CartItem | null> {
  const supabase = await createClient();

  if (quantity <= 0) {
    await removeCartItem(itemId);
    return null;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating cart item:', error);
    return null;
  }

  return data as CartItem;
}

export async function removeCartItem(itemId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error removing cart item:', error);
    return false;
  }

  return true;
}

export async function clearCart(cartId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (error) {
    console.error('Error clearing cart:', error);
    return false;
  }

  return true;
}

export async function mergeGuestCart(guestSessionId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();

  // Get guest cart
  const guestCart = await getCart(undefined, guestSessionId);
  if (!guestCart) return true;

  // Get or create user cart
  let userCart = await getCart(userId);
  if (!userCart) {
    userCart = await createCart(userId);
    if (!userCart) return false;
  }

  // Move all items from guest cart to user cart
  const { data: guestItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', guestCart.id);

  if (guestItems && guestItems.length > 0) {
    for (const item of guestItems) {
      await addToCart(userCart.id, item.product_id, item.size, item.color, item.quantity);
    }
  }

  // Clear guest cart
  await clearCart(guestCart.id);

  // Delete guest cart
  await supabase.from('carts').delete().eq('id', guestCart.id);

  return true;
}

// Client-side cart functions for localStorage
export function getGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem('guest_cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
}

export function addToGuestCart(product: Product, size: string, color: string, quantity: number = 1): CartItem[] {
  const cart = getGuestCart();
  const existingItemIndex = cart.findIndex(
    item => item.product_id === product.id && item.size === size && item.color === color
  );

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: `guest_${Date.now()}_${Math.random()}`,
      cart_id: 'guest',
      product_id: product.id,
      product,
      size,
      color,
      quantity,
      created_at: new Date().toISOString(),
    });
  }

  saveGuestCart(cart);
  return cart;
}

export function removeFromGuestCart(itemId: string): CartItem[] {
  const cart = getGuestCart().filter(item => item.id !== itemId);
  saveGuestCart(cart);
  return cart;
}

export function updateGuestCartItem(itemId: string, quantity: number): CartItem[] {
  const cart = getGuestCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
  }

  saveGuestCart(cart);
  return cart;
}