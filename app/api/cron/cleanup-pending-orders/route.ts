import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function GET() {
    const supabase = supabaseAdmin();

    try {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

        // Delete or update old pending orders
        const { data, error } = await supabase
            .from("orders")
            .delete()
            .lte("created_at", yesterday)
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
