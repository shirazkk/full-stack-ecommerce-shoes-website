import { createClient } from '@/lib/supabase/server';
import { Order, OrderItem, Address } from '@/types';

export async function createOrder(
  userId: string,
  items: Array<{
    product_id: string;
    quantity: number;
    size: string;
    color: string;
    price: number;
  }>,
  shippingAddress: Address,
  subtotal: number,
  tax: number,
  shipping: number,
  total: number,
  stripePaymentIntentId?: string
): Promise<Order | null> {
  const supabase = await createClient();

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      order_number: orderNumber,
      status: 'pending',
      subtotal,
      tax,
      shipping,
      total,
      stripe_payment_intent_id: stripePaymentIntentId,
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }

  return order as Order;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data as Order;
}

export async function getUserOrders(
  userId: string,
  status?: string,
  limit: number = 10,
  offset: number = 0
): Promise<Order[]> {
  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }

  return data as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

export async function getOrdersByStatus(
  status: string,
  limit: number = 50,
  offset: number = 0
): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }

  return data as Order[];
}

export async function getAllOrders(
  status?: string,
  limit: number = 50,
  offset: number = 0
): Promise<Order[]> {
  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }

  return data as Order[];
}