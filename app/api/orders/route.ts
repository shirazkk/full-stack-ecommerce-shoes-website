import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getUserOrders, getAllOrders } from '@/lib/services/order.service';
import { getUser, isAdmin } from '@/lib/auth/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdminUser = await isAdmin();

    let orders;
    const offset = (page - 1) * limit;

    if (isAdminUser) {
      // Admin can see all orders
      orders = await getAllOrders(status || undefined, limit, offset);
    } else {
      // Regular users can only see their own orders
      orders = await getUserOrders(user.id, status || undefined, limit, offset);
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      subtotal,
      tax,
      shipping,
      total,
      stripePaymentIntentId,
    } = body;

    // Validate required fields
    if (!items || !shippingAddress || !subtotal || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await createOrder(
      user.id,
      items,
      shippingAddress,
      subtotal,
      tax || 0,
      shipping || 0,
      total,
      stripePaymentIntentId
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}