import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/lib/services/review.service";

// ✅ Update review
export async function PUT(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { rating, comment } = await request.json();
        await ReviewService.updateReview(id, rating, comment);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("❌ Error updating review:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 🗑 DELETE /api/reviews/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await ReviewService.deleteReview(id);
    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting review:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
