import { createClient } from '@/lib/supabase/server';
import { Order, OrderItem, Address } from '@/types';
import { supabaseAdmin } from '../supabase/supabaseAdmin';


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

  // Validation
  if (!userId || !items?.length || !shippingAddress) return null;

  try {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // 1️⃣ Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        status: "pending",
        subtotal,
        tax,
        shipping,
        total,
        stripe_payment_intent_id: stripePaymentIntentId,
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // 2️⃣ Create order items
    const orderItemsData = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
    }));

    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData)
      .select(); // Return inserted items

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Optionally delete the order to avoid orphan orders
      await supabase.from('orders').delete().eq('id', order.id);
      return null;
    }

    // 3️⃣ Return order with inserted items
    return {
      ...order,
      order_items: orderItems as OrderItem[],
    } as Order;

  } catch (err) {
    console.error('Unexpected error creating order:', err);
    return null;
  }
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentIntentId: string
): Promise<boolean> {
  const supabase = await supabaseAdmin();
  // we have to use supabase serivce key to update order status
  const { error } = await supabase
    .from('orders')
    .update({ status, stripe_payment_intent_id: paymentIntentId })
    .eq('id', orderId)
    .select();

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

export async function getTotalOrdersCount(status?: string, userId?: string) {
  const supabase = await createClient();
  try {
    let query = supabase.from('orders').select('id', { count: 'exact', head: true });

    // Filter by user
    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error fetching orders count:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Unexpected error fetching orders count:', err);
    return 0;
  }
}


export async function getOrderId(orderId: string): Promise<Order | null> {
  const supabase = await supabaseAdmin();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      user_id,
      total,
      status,
      shipping_address,
      order_items (
        product_id,
        quantity,
        size,
        color,
        price
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("❌ Error fetching order:", error);
    return null;
  }

  return data as Order;

}

export async function getOrderCount(){
  const supabase = await supabaseAdmin();
  const { count, error } = await supabase.from('orders').select('id', { count: 'exact', head: true });
  if (error) {
    console.error('Error fetching orders count:', error);
    return 0;
  }
  return count || 0;
}