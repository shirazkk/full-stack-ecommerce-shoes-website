import { NextResponse } from "next/server";
import { getAllUsers, isAdmin } from "@/lib/auth/server";


export async function GET() {
    const admin = await isAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const users = await getAllUsers();

        if (!users) {
            return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
        }

        return NextResponse.json({ users }, { status: 200 });

    } catch (err) {
        console.error("❌ Dashboard API error:", err);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
