import { NextResponse } from "next/server";
import { getOrderCount } from "@/lib/services/order.service";
import { stripe } from "@/lib/stripe/server";
import { isAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function GET() {
    const admin = await isAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const supabase = supabaseAdmin();

        // 1️⃣ Total Orders
        const totalOrders = await getOrderCount();

        // 2️⃣ Total Revenue
        let totalRevenue = 0;

        try {
            const balance = await stripe.balance.retrieve();
            totalRevenue = balance.pending.reduce(
                (acc, item) => acc + item.amount / 100,
                0
            );
        } catch (err) {
            console.error("❌ Failed to fetch Stripe revenue:", err);
        }

        // 3️⃣ Total Products
        const { count: totalProducts, error: prodError } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true });
        if (prodError) throw prodError;

        // 4️⃣ Total Users
        const { count: totalUsers, error: userError } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });
        if (userError) throw userError;

        // 5️⃣ Recent Orders
        const recentOrdersRes = await supabase
            .from("orders")
            .select("id, order_number, total, status, created_at, user_id")
            .order("created_at", { ascending: false })
            .limit(5);
        const recentOrders = recentOrdersRes.data || [];

        // 6️⃣ Top Products (based on quantity sold)
        const topProductsRes = await supabase
            .from("order_items")
            .select("product_id, quantity, price, products(name,slug, images)")
        const productMap: Record<string, { name: string, slug: string, image: string, sales: number, revenue: number }> = {};

        topProductsRes.data?.forEach(item => {
            const prodId = item.product_id;
            const prod = Array.isArray(item.products) ? item.products[0] : item.products;

            if (!prod) return;

            if (!productMap[prodId]) {
                productMap[prodId] = {
                    name: prod.name || "Unknown",
                    image: prod.images?.[0] || "",
                    slug: prod.slug,
                    sales: 0,
                    revenue: 0,
                };
            }

            productMap[prodId].sales += item.quantity;
            productMap[prodId].revenue += item.quantity * item.price;
        });


        const topProducts = Object.values(productMap)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        return NextResponse.json({
            stats: { totalRevenue, totalOrders, totalProducts, totalUsers },
            recentOrders,
            topProducts,
        });
    } catch (err) {
        console.error("❌ Dashboard API error:", err);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
