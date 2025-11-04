import { createClient } from '../supabase/server';
import { Product, Category } from '@/types';
import { supabaseAdmin } from '../supabase/supabaseAdmin';

export interface ProductFilters {
  category?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at' | 'rating';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  hasMore: boolean;
}

export class ProductService {
  static async getAllProducts(filters: ProductFilters = {}): Promise<ProductSearchResult> {
    const supabase = await createClient();

    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `, { count: 'exact' });

    // Apply filters
    if (filters.category) {
      // Get category by slug first
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.category)
        .single();

      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    if (filters.brands && filters.brands.length > 0) {
      query = query.in('brand', filters.brands);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.colors && filters.colors.length > 0) {
      query = query.overlaps('colors', filters.colors);
    }

    if (filters.sizes && filters.sizes.length > 0) {
      query = query.overlaps('sizes', filters.sizes);
    }

    if (filters.isFeatured !== undefined) {
      query = query.eq('is_featured', filters.isFeatured);
    }

    if (filters.isNew !== undefined) {
      query = query.eq('is_new', filters.isNew);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const limit = filters.limit || 12;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      products: data as Product[],
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    };
  }

  static async getProductBySlug(slug: string): Promise<Product> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return data as Product;
  }

  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return data as Product[];
  }

  static async getNewArrivals(limit: number = 8): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch new arrivals: ${error.message}`);
    }

    return data as Product[];
  }

  static async searchProducts(query: string, limit: number = 12): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }

    return data as Product[];
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .eq('category_id', categoryId)
      .neq('id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }

    return data as Product[];
  }

  static async getCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data as Category[];
  }

  static async getBrands(): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null)
      .order('brand', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }

    // Get unique brands
    const brands = [...new Set(data.map(item => item.brand))];
    return brands;
  }

  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data as Product;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description,
          image_url
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data as Product;
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return true;
  }

  static async decreaseStock(productId: string, quantity: number): Promise<void> {
    const supabase = await supabaseAdmin();

    // 1️⃣ Get current stock
    const { data, error } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (error || !data) {
      throw new Error(`Failed to fetch stock for product ${productId}: ${error?.message}`);
    }

    const currentStock = data.stock ?? 0;
    const newStock = currentStock - quantity;

    // 2️⃣ Prevent negative stock
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    // 3️⃣ Update stock
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId)
      .gte('stock', quantity);

    if (updateError) {
      throw new Error(`Failed to update stock: ${updateError.message}`);
    }

    console.log(`Stock updated: ${productId} → ${newStock}`);
  }

}

