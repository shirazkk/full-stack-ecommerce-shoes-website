import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/lib/services/product.service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const filters = {
      category: searchParams.get('category') || undefined,
      brands: searchParams.getAll('brands') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      colors: searchParams.get('colors')?.split(',').filter(Boolean),
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean),
      isFeatured: searchParams.get('isFeatured') === 'true' ? true : searchParams.get('isFeatured') === 'false' ? false : undefined,
      isNew: searchParams.get('isNew') === 'true' ? true : searchParams.get('isNew') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'created_at' | 'rating') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    const result = await ProductService.getAllProducts(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}