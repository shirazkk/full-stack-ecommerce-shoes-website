import { ProductService } from "@/lib/services/product.service";
import { ReviewService } from "@/lib/services/review.service";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";


// ✅ Get all reviews (paginated)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    try {
        // 1️⃣ Fetch product ID from slug
        const product = await ProductService.getProductBySlug(slug);

        if (!product) {
            throw new Error("Product not found");
        }

        // 2️⃣ Fetch reviews using product.id
        const reviews = await ReviewService.getReviews(product.id, limit, page);

        return NextResponse.json({ reviews });
    } catch (error: any) {
        console.error("❌ Error fetching reviews:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ✅ Add new review
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const { rating, comment } = await req.json();
        const product = await ProductService.getProductBySlug(slug);

        if (!product) {
            throw new Error("Product not found");
        }
        await ReviewService.addReview(product.id, rating, comment);
        return NextResponse.json({ success: true, message: "Review added successfully" });
    } catch (error: any) {
        console.error("❌ Error adding review:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
