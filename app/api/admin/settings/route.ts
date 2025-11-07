import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const supabase = supabaseAdmin();
    
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = supabaseAdmin();
    const body = await request.json();

    const { data, error } = await supabase
      .from('store_settings')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}