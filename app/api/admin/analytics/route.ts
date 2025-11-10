// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/services/analytics.service";
import { isAdmin } from "@/lib/auth/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeRangeParam = (url.searchParams.get("timeRange") || "30d") as
      | "7d"
      | "30d"
      | "90d"
      | "1y";


    const admin = await isAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const analytics = await getAnalytics(timeRangeParam);
    return NextResponse.json(analytics);
  } catch (err) {
    console.error("Error in analytics route:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
