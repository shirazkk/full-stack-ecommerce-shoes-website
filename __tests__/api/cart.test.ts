import { GET, POST } from '@/app/api/cart/route';
import { CartService } from '@/lib/services/cart.service';
import { createServerClient } from '@/lib/supabase/server';

jest.mock('@/lib/services/cart.service');
jest.mock('@/lib/supabase/server');

describe('/api/cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return cart for authenticated user', async () => {
      const mockCart = {
        id: '1',
        user_id: 'user-1',
        cart_items: [],
      };

      const mockSession = {
        data: {
          session: {
            user: { id: 'user-1' },
          },
        },
      };

      (createServerClient as jest.Mock).mockImplementation(() => ({
        auth: {
          getSession: jest.fn().mockResolvedValue(mockSession),
        },
      }));

      (CartService.getCart as jest.Mock).mockResolvedValue(mockCart);

      const request = new Request('http://localhost:3000/api/cart');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCart);
      expect(CartService.getCart).toHaveBeenCalledWith('user-1', null);
    });

    it('should return cart for guest user with session ID', async () => {
      const mockCart = {
        id: '1',
        session_id: 'session-1',
        cart_items: [],
      };

      (createServerClient as jest.Mock).mockImplementation(() => ({
        auth: {
          getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        },
      }));

      (CartService.getCart as jest.Mock).mockResolvedValue(mockCart);

      const request = new Request('http://localhost:3000/api/cart?sessionId=session-1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCart);
      expect(CartService.getCart).toHaveBeenCalledWith(null, 'session-1');
    });
  });

  describe('POST', () => {
    it('should create a new cart for authenticated user', async () => {
      const mockCart = {
        id: '1',
        user_id: 'user-1',
      };

      const mockSession = {
        data: {
          session: {
            user: { id: 'user-1' },
          },
        },
      };

      (createServerClient as jest.Mock).mockImplementation(() => ({
        auth: {
          getSession: jest.fn().mockResolvedValue(mockSession),
        },
      }));

      (CartService.createCart as jest.Mock).mockResolvedValue(mockCart);

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCart);
      expect(CartService.createCart).toHaveBeenCalledWith('user-1', undefined);
    });
  });
});