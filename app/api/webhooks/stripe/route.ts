import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe/server"
import { updateOrderStatus } from "@/lib/services/order.service"


export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }
  const buf = Buffer.from(await req.arrayBuffer())

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("✅ Webhook received:", event.type)

  try {
    switch (event.type) {
      case "payment_intent.created": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId
        console.log("🎯 Order ID (created):", orderId)
        break
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId
        console.log("🎯 Order ID (succeeded):", orderId)

        if (orderId) {
          await updateOrderStatus(orderId, "processing", paymentIntent.id)
          console.log("✅ Order marked as processing")
        } else {
          console.warn("⚠️ No orderId found in metadata")
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId
        console.log("🎯 Order ID (failed):", orderId)

        if (orderId) {
          await updateOrderStatus(orderId, "cancelled", paymentIntent.id)
          console.log("✅ Order marked as failed")
        }
        break
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId
        console.log("🎯 Order ID (canceled):", orderId)
        if (orderId) {
          await updateOrderStatus(orderId, "cancelled", paymentIntent.id)
          console.log("✅ Order marked as cancelled")
        }
        break
      }

      default:
        console.log(`ℹ️ Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("🚨 Webhook handler error:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
