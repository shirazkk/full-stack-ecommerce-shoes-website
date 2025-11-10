// lib/services/analytics.service.ts
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

type TimeRange = "7d" | "30d" | "90d" | "1y";

function parseTimeRange(timeRange: TimeRange) {
    const now = new Date();
    let start = new Date(now);
    switch (timeRange) {
        case "7d":
            start.setDate(now.getDate() - 7);
            break;
        case "30d":
            start.setDate(now.getDate() - 30);
            break;
        case "90d":
            start.setDate(now.getDate() - 90);
            break;
        case "1y":
            start.setFullYear(now.getFullYear() - 1);
            break;
        default:
            start.setDate(now.getDate() - 30);
    }
    return { start, end: now };
}

function formatDateKey(d: Date, granularity: "day" | "month" = "day") {
    if (granularity === "month") {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
}

export async function getAnalytics(timeRange: TimeRange = "30d") {
    const supabase = supabaseAdmin();
    const { start, end } = parseTimeRange(timeRange);

    // 1) Fetch orders in the period (exclude cancelled if you want)
    // Note: in heavy datasets, prefer DB-side aggregates or add pagination / limits here.
    const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id,user_id,total,subtotal,tax,shipping,status,created_at")
        .gte("created_at", start.toISOString())
        // optionally exclude cancelled:
        .neq("status", "cancelled");

    if (ordersError) {
        console.error("Analytics: orders query error", ordersError);
    }

    const orders = ordersData ?? [];

    // 2) Aggregate revenue, orders count, unique customers
    const revenueTotal = orders.reduce((s: number, o: any) => s + (o.total ?? 0), 0);
    const ordersTotal = orders.length;
    const customersSet = new Set(orders.map((o: any) => o.user_id));
    const customersTotal = customersSet.size;

    // 3) Build daily chart points for revenue and orders (granularity = day; fallback to month for 1y)
    const granularity = timeRange === "1y" ? "month" : "day";
    // create date keys in range
    const chartMapRevenue = new Map<string, number>();
    const chartMapOrders = new Map<string, number>();

    // initialize keys
    const cursor = new Date(start);
    while (cursor <= end) {
        const key = formatDateKey(cursor, granularity);
        chartMapRevenue.set(key, 0);
        chartMapOrders.set(key, 0);
        if (granularity === "day") cursor.setDate(cursor.getDate() + 1);
        else cursor.setMonth(cursor.getMonth() + 1);
    }

    for (const o of orders) {
        const d = new Date(o.created_at);
        const key = formatDateKey(d, granularity);
        chartMapRevenue.set(key, (chartMapRevenue.get(key) ?? 0) + (o.total ?? 0));
        chartMapOrders.set(key, (chartMapOrders.get(key) ?? 0) + 1);
    }

    const revenueChart = Array.from(chartMapRevenue.entries()).map(([date, value]) => ({
        date,
        value,
    }));
    const ordersChart = Array.from(chartMapOrders.entries()).map(([date, value]) => ({
        date,
        value,
    }));
    const customersChart = ordersChart.map((p) => ({ date: p.date, value: 0 })); // you can compute active customers per day if needed

    // 4) Top products and sales-by-category
    // Fetch order_items within period and join product basic data
    const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(`
      id,
      order_id,
      product_id,
      quantity,
      price,
      products:product_id ( id, name, images, category_id ),
      categories:products!product_id ( category_id )   -- optional, depends on your relationship
    `)
        // join via orders' ids
        .in("order_id", orders.map((o: any) => o.id));

    if (itemsError) {
        console.error("Analytics: order_items query error", itemsError);
    }

    const items = itemsData ?? [];

    // aggregate per productId
    const prodMap = new Map<
        string,
        { id: string; name: string; image?: string; sales: number; revenue: number; categoryId?: string }
    >();

    // sales by category aggregator
    const categoryMap = new Map<string, number>();

    for (const it of items as any[]) {
        const pid = it.product_id ?? "";
        const qty = it.quantity ?? 0;
        const price = it.price ?? 0;
        const prod = it.products ?? null;
        const pname = prod?.name ?? `#${pid}`;
        const image =
            Array.isArray(prod?.images) && prod.images.length ? prod.images[0] : "";
        const catId = prod?.category_id ?? null;

        const existing = prodMap.get(pid) ?? {
            id: pid,
            name: pname,
            image,
            sales: 0,
            revenue: 0,
            categoryId: catId,
        };
        existing.sales += qty;
        existing.revenue += qty * price;
        prodMap.set(pid, existing);

        // category aggregate (if category exists)
        const catKey = catId ?? "uncategorized";
        categoryMap.set(catKey, (categoryMap.get(catKey) ?? 0) + qty);
    }

    const topProducts = Array.from(prodMap.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10)
        .map((p) => ({
            id: p.id,
            name: p.name,
            sales: p.sales,
            revenue: p.revenue,
            image: p.image || "/placeholder.png",
        }));

    const totalCategorySales = Array.from(categoryMap.values()).reduce((s, v) => s + v, 0);
    const salesByCategory = Array.from(categoryMap.entries())
        .map(([categoryId, sales]) => ({
            category: categoryId,
            sales,
            percentage: totalCategorySales ? Math.round((sales / totalCategorySales) * 100) : 0,
        }))
        .sort((a, b) => b.sales - a.sales);

    // 5) compute percent changes vs previous same period (simple approach)
    // For simplicity, fetch previous period orders (same length) and compute revenue/orders/customers change
    const prevStart = new Date(start);
    const prevEnd = new Date(start);
    const periodLengthMs = end.getTime() - start.getTime();
    prevStart.setTime(start.getTime() - periodLengthMs);
    prevEnd.setTime(start.getTime() - 1);

    const { data: prevOrdersData } = await supabase
        .from("orders")
        .select("id,user_id,total,created_at,status")
        .gte("created_at", prevStart.toISOString())
        .lte("created_at", prevEnd.toISOString())
        .neq("status", "cancelled");

    const prevOrders = prevOrdersData ?? [];
    const prevRevenue = prevOrders.reduce((s: number, o: any) => s + (o.total ?? 0), 0);
    const prevOrdersTotal = prevOrders.length;
    const prevCustomers = new Set(prevOrders.map((o: any) => o.user_id)).size;

    const safePct = (nowVal: number, prevVal: number) => {
        if (prevVal === 0) return nowVal === 0 ? 0 : 100;
        return Math.round(((nowVal - prevVal) / prevVal) * 100);
    };

    const analytics = {
        revenue: {
            total: Math.round(revenueTotal * 100) / 100,
            change: safePct(revenueTotal, prevRevenue),
            chart: revenueChart,
        },
        orders: {
            total: ordersTotal,
            change: safePct(ordersTotal, prevOrdersTotal),
            chart: ordersChart,
        },
        customers: {
            total: customersTotal,
            change: safePct(customersTotal, prevCustomers),
            chart: customersChart,
        },
        topProducts,
        salesByCategory,
    };

    return analytics;
}
