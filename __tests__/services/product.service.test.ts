import { ProductService } from '@/lib/services/product.service';
import { supabase } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should fetch all products with default options', async () => {
      const mockProducts = [
        { id: '1', name: 'Test Product 1' },
        { id: '2', name: 'Test Product 2' },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockProducts, error: null }),
      });

      const result = await ProductService.getAllProducts();
      expect(result).toEqual(mockProducts);
    });

    it('should apply filters when options are provided', async () => {
      const mockProducts = [{ id: '1', name: 'Test Product 1' }];
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockIlike = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockResolvedValue({ data: mockProducts, error: null });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        ilike: mockIlike,
        order: mockOrder,
      });

      await ProductService.getAllProducts({
        category: 'test-category',
        search: 'test',
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(mockSelect).toHaveBeenCalledWith('*, categories(name, slug)');
      expect(mockIlike).toHaveBeenCalledWith('name', '%test%');
    });
  });

  describe('getProductBySlug', () => {
    it('should fetch a product by slug', async () => {
      const mockProduct = { id: '1', name: 'Test Product', slug: 'test-product' };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProduct, error: null }),
      });

      const result = await ProductService.getProductBySlug('test-product');
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when product is not found', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
      });

      await expect(ProductService.getProductBySlug('non-existent')).rejects.toThrow();
    });
  });
});