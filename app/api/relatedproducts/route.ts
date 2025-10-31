import { NextResponse } from "next/server";
import { ProductService } from "@/lib/services/product.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const category_id = searchParams.get("categoryId");
    const limit = searchParams.get("limit");

    if (!productId || !category_id) {
      return NextResponse.json(
        { error: "Product ID and category are required" },
        { status: 400 }
      );
    }

    const relatedProducts = await ProductService.getRelatedProducts(
      productId,
      category_id,
      limit ? parseInt(limit) : 4
    );

    return NextResponse.json({ products: relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}