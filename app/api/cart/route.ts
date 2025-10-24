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

      return NextResponse.json({ cart: newCart });
    }

    return NextResponse.json({ cart });
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
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
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

    // Add item to cart
    const { data: cartItem, error: itemError } = await supabase
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

    return NextResponse.json({ cartItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}