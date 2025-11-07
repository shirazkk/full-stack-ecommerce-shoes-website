import { NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/stripe/server"
import { getUser } from "@/lib/auth/server"

export async function POST(request: Request) {
    try {
        const user = await getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        // console.log("💡 Creating payment intent for user:", user)

        const { amount, orderId } = await request.json()

        if (!amount || !orderId) {
            return NextResponse.json({ error: "Amount and orderId are required" }, { status: 400 })
        }

        // console.log("💡 Payment intent amount:", amount)
        // console.log("💡 Payment intent orderId:", orderId)

        const metadata = {
            userId: user.id,
            orderId,
        }

        // console.log("💡 Payment intent metadata:", metadata)

        const paymentIntent = await createPaymentIntent(amount, metadata)
        // console.log("✅ Payment intent created:", paymentIntent.id)

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        })
    } catch (error: any) {
        console.error("❌ Stripe payment intent creation failed:", error)
        return NextResponse.json({ error: error.message || "Failed to create payment intent" }, { status: 500 })
    }
}
