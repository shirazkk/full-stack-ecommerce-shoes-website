import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/services/order.service';
import { getUser, isAdmin } from '@/lib/auth/server';
import { ProductService } from '@/lib/services/product.service';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user owns this order or is admin
    const isAdminUser = await isAdmin();
    if (!isAdminUser && order.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch user info of the order owner
    const supabase = supabaseAdmin();
    const { data: orderUser, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', order.user_id)
      .single();

    if (userError) console.warn('Failed to fetch order user:', userError);

    return NextResponse.json({ order, user: orderUser });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can update order status
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status, paymentIntentId } = body;

    if (!status || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Status and paymentIntentId are required' },
        { status: 400 }
      );
    }

    // 1️⃣ Get the current order (with items)
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2️⃣ If status is being changed to "cancelled", restock items
    if (status === 'cancelled') {
      for (const item of order.order_items!) {
        await ProductService.reStockProduct(item.product_id!, item.quantity);
      }
    }

    // 3️⃣ Update order status
    const updatedOrder = await updateOrderStatus(id, status, paymentIntentId);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Order updated to "${status}" successfully`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}



export async function PUT(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }


    const success = await updateOrderStatus(id, status as any);

    if (!success) {
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating order status:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
