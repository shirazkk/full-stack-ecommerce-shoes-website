import { ProductService } from "@/lib/services/product.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 5;

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const products = await ProductService.searchProducts(query, limit);
    return NextResponse.json({ products });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}