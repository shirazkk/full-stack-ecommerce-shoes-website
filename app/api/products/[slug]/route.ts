import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/product.service';
import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { isAdmin } from '@/lib/auth/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const admin = await isAdmin(); 
    const product = await ProductService.getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (!admin && product.status !== 'active') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}



export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const updates = await req.json();
    const supabase = supabaseAdmin();

    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();


    if (fetchError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct = await ProductService.updateProduct(product.id, updates);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product update failed or not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const supabase = await supabaseAdmin();

    // Get product ID by slug
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await ProductService.deleteProduct(product.id);
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}



