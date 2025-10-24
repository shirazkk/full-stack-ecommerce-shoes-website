import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { cartId: string; itemId: string } }
) {
  try {
    const user = await getUser();
    const supabase = await createClient();

    // Verify cart ownership
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('user_id, session_id')
      .eq('id', params.cartId)
      .single();

    if (cartError || !cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Check if user owns this cart
    if (user && cart.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!user && cart.session_id !== request.cookies.get('session_id')?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { quantity, size, color } = body;

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, size, color })
      .eq('id', params.itemId)
      .eq('cart_id', params.cartId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { cartId: string; itemId: string } }
) {
  try {
    const user = await getUser();
    const supabase = await createClient();

    // Verify cart ownership
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('user_id, session_id')
      .eq('id', params.cartId)
      .single();

    if (cartError || !cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Check if user owns this cart
    if (user && cart.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!user && cart.session_id !== request.cookies.get('session_id')?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', params.itemId)
      .eq('cart_id', params.cartId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete cart item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
}