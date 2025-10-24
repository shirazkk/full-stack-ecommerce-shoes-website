import { GET, POST } from '@/app/api/products/route';
import { ProductService } from '@/lib/services/product.service';

jest.mock('@/lib/services/product.service');

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return products with query parameters', async () => {
      const mockProducts = [
        { id: '1', name: 'Test Product 1' },
        { id: '2', name: 'Test Product 2' },
      ];

      (ProductService.getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      const request = new Request('http://localhost:3000/api/products?limit=10&category=shoes');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProducts);
      expect(ProductService.getAllProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          category: 'shoes',
        })
      );
    });

    it('should handle errors', async () => {
      (ProductService.getAllProducts as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new Request('http://localhost:3000/api/products');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch products' });
    });
  });

  describe('POST', () => {
    it('should create a new product', async () => {
      const mockProduct = {
        id: '1',
        name: 'New Product',
        slug: 'new-product',
        price: 99.99,
      };

      (ProductService.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(mockProduct),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockProduct);
      expect(ProductService.createProduct).toHaveBeenCalledWith(mockProduct);
    });

    it('should handle validation errors', async () => {
      (ProductService.createProduct as jest.Mock).mockRejectedValue(new Error('Invalid data'));

      const request = new Request('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to create product' });
    });
  });
});