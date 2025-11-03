import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getUserOrders, getAllOrders, getTotalOrdersCount } from '@/lib/services/order.service';
import { getUser, isAdmin } from '@/lib/auth/server';


export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const isAdminUser = await isAdmin();

    let orders: any[] = [];
    let totalOrdersCount = 0;

    if (isAdminUser) {
      orders = await getAllOrders(status || undefined, limit, offset);
      totalOrdersCount = await getTotalOrdersCount(status || undefined); // implement this in service
    } else {
      orders = await getUserOrders(user.id, status || undefined, limit, offset);
      totalOrdersCount = await getTotalOrdersCount(status || undefined, user.id);
    }

    const totalPages = Math.ceil(totalOrdersCount / limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: totalOrdersCount,
        hasMore: page < totalPages,
      },
    });
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
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderId: order.id,
        total: order.total,
        orderNumber: order.order_number,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}