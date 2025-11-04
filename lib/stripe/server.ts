import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
})
console.log(stripe)

export async function createPaymentIntent(amount: number, metadata: Record<string, string> = {}) {
    return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
        metadata,
    })
}

// export async function createCheckoutSession(
//     items: Array<{
//         price_data: {
//             currency: string
//             product_data: {
//                 name: string
//                 description?: string
//                 images?: string[]
//             }
//             unit_amount: number
//         }
//         quantity: number
//     }>,
//     userId: string,
//     orderId: string,
//     successUrl: string,
//     cancelUrl: string,
// ) {
//     return await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: items,
//         mode: "payment",
//         success_url: successUrl,
//         cancel_url: cancelUrl,
//         customer_email: undefined, // Will be set by user during checkout
//         metadata: {
//             userId,
//             orderId,
//         },
//     })
// }
