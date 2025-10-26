import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: brands, error } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null)
      .order('brand');

    if (error) {
      console.error('Error fetching brands:', error);
      return NextResponse.json(
        { error: 'Failed to fetch brands' },
        { status: 500 }
      );
    }

    // Get unique brands
    const uniqueBrands = [...new Set(brands.map(item => item.brand))].sort();

    return NextResponse.json({ brands: uniqueBrands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
