import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { updateOrderStatus } from '@/lib/services/order.service';
import { clearCart } from '@/lib/services/cart.service';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const userId = paymentIntent.metadata.userId;

        if (orderId) {
          // Update order status to processing
          await updateOrderStatus(orderId, 'processing');

          // Clear user's cart
          if (userId) {
            const supabase = await createClient();
            const { data: cart } = await supabase
              .from('carts')
              .select('id')
              .eq('user_id', userId)
              .single();

            if (cart) {
              await clearCart(cart.id);
            }
          }

          console.log(`Order ${orderId} payment succeeded`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await updateOrderStatus(orderId, 'cancelled');
          console.log(`Order ${orderId} payment failed`);
        }
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (orderId) {
          // Update order status to processing
          await updateOrderStatus(orderId, 'processing');

          // Clear user's cart
          if (userId) {
            const supabase = await createClient();
            const { data: cart } = await supabase
              .from('carts')
              .select('id')
              .eq('user_id', userId)
              .single();

            if (cart) {
              await clearCart(cart.id);
            }
          }

          console.log(`Checkout session completed for order ${orderId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
