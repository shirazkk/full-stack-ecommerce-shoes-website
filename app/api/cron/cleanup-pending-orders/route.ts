import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const secret = url.searchParams.get("secret");

        if (!secret || secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = supabaseAdmin();
        const now = new Date();

        // Delete orders older than 7 days
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from("orders")
            .delete()
            .lte("created_at", sevenDaysAgo)
            .eq("status", "pending");

        if (error) {
            console.error("❌ Error cleaning pending orders:", error);
            return NextResponse.json({ error: "Failed to clean up pending orders" }, { status: 500 });
        }

        console.log(`✅ Cleaned ${data || 0} old pending orders`);
        return NextResponse.json({ message: "Pending orders cleanup complete" });
    } catch (err) {
        console.error("🚨 Cleanup job error:", err);
        return NextResponse.json({ error: "Cleanup job failed" }, { status: 500 });
    }
}
