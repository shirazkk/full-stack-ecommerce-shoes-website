import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe/server"
import { getOrderId, updateOrderStatus } from "@/lib/services/order.service"
import { ProductService } from "@/lib/services/product.service";
import { sendEmail } from "@/lib/Email/email";
import { orderSuccessTemplate, paymentFailedTemplate } from "@/lib/Email/emailTemplates";


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

  // console.log("✅ Webhook received:", event.type)

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

          const order = await getOrderId(orderId);
          console.log(order)

          if (order?.order_items) {
            for (const item of order.order_items) {
              await ProductService.decreaseStock(item.product?.id!, item.quantity);
              console.log("items" + item)
            }
          }
          console.log("✅ Stock levels updated")

          const email = order?.shipping_address?.email;
          if (email) {
            await sendEmail({
              to: email,
              subject: "🎉 Your PakiShoes Order is Confirmed!",
              html: orderSuccessTemplate(order),
            });
          }

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

          const order = await getOrderId(orderId);
          console.log(order)

          const email = order?.shipping_address?.email;
          if (email) {
            await sendEmail({
              to: email,
              subject: "❌ Payment Failed for Your PakiShoes Order",
              html: paymentFailedTemplate(order),
            });
          }
        }
        else {
          console.warn("⚠️ No orderId found in metadata")
        }
        break
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId
        console.log("🎯 Order ID (canceled):", orderId)

        if (orderId) {
          await updateOrderStatus(orderId, "cancelled", paymentIntent.id)
          console.log("✅ Order marked as failed")

          const order = await getOrderId(orderId);
          console.log(order)
        }
        else {
          console.warn("⚠️ No orderId found in metadata")
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
