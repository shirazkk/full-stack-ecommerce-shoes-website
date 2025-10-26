import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        *,
        cart_items (
          *,
          product:products (*)
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (cartError && cartError.code !== 'PGRST116') {
      console.error('Error fetching cart:', cartError);
      return NextResponse.json(
        { error: 'Failed to fetch cart' },
        { status: 500 }
      );
    }

    if (!cart) {
      // Create new cart if none exists
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select(`
          *,
          cart_items (
            *,
            product:products (*)
          )
        `)
        .single();

      if (createError) {
        console.error('Error creating cart:', createError);
        return NextResponse.json(
          { error: 'Failed to create cart' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        cart: {
          ...newCart,
          items: newCart.cart_items || []
        }
      });
    }

    // Cart exists, return it with items
    return NextResponse.json({ 
      cart: {
        ...cart,
        items: cart.cart_items || []
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity, size, color } = await request.json();

    if (!productId || !quantity || !size || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create cart
    let { data: cart } = await supabase
      .from('carts')
      .select(`
        *,
        cart_items (
          *,
          product:products (*)
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select(`
          *,
          cart_items (
            *,
            product:products (*)
          )
        `)
        .single();

      if (createError) {
        console.error('Error creating cart:', createError);
        return NextResponse.json(
          { error: 'Failed to create cart' },
          { status: 500 }
        );
      }
      cart = newCart;
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('color', color)
      .single();

    let cartItem;

    if (existingItem) {
      // Update quantity if item already exists
      const { data, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select(`
          *,
          product:products (*)
        `)
        .single();

      if (updateError) {
        console.error('Error updating cart item:', updateError);
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        );
      }

      cartItem = data;
    } else {
      // Add new item to cart
      const { data, error: itemError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity,
          size,
          color,
        })
        .select(`
          *,
          product:products (*)
        `)
        .single();

      if (itemError) {
        console.error('Error adding item to cart:', itemError);
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        );
      }

      cartItem = data;
    }

    // Fetch updated cart with all items
    const { data: updatedCart } = await supabase
      .from('carts')
      .select(`
        *,
        cart_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', cart.id)
      .single();

    return NextResponse.json({ 
      cartItem, 
      cart: {
        ...updatedCart,
        items: updatedCart.cart_items || []
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}