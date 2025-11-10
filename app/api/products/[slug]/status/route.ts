import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const body = await req.json();
    const { status } = body;

    // Validate status
    const allowedStatuses = ["active", "inactive", "draft"];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const supabase = await supabaseAdmin();

    const { data, error } = await supabase
      .from("products")
      .update({ status })
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Status updated", product: data });
  } catch (err: any) {
    console.error("Error updating product status:", err);
    return NextResponse.json({ error: "Failed to update product status" }, { status: 500 });
  }
}
