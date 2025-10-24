import { CartService } from '@/lib/services/cart.service';
import { supabase } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should fetch cart by user ID', async () => {
      const mockCart = {
        id: '1',
        user_id: 'user-1',
        cart_items: [
          { id: '1', product_id: 'prod-1', quantity: 1 },
        ],
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockCart, error: null }),
      });

      const result = await CartService.getCart('user-1', null);
      expect(result).toEqual(mockCart);
    });

    it('should fetch cart by session ID', async () => {
      const mockCart = {
        id: '1',
        session_id: 'session-1',
        cart_items: [],
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockCart, error: null }),
      });

      const result = await CartService.getCart(null, 'session-1');
      expect(result).toEqual(mockCart);
    });
  });

  describe('addCartItem', () => {
    it('should add item to cart', async () => {
      const mockCartItem = {
        id: '1',
        cart_id: 'cart-1',
        product_id: 'prod-1',
        quantity: 1,
      };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockCartItem, error: null }),
      });

      const result = await CartService.addCartItem('cart-1', {
        product_id: 'prod-1',
        quantity: 1,
        size: 'M',
        color: 'black',
      });

      expect(result).toEqual(mockCartItem);
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity', async () => {
      const mockCartItem = {
        id: '1',
        quantity: 2,
      };

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockCartItem, error: null }),
      });

      const result = await CartService.updateCartItem('1', { quantity: 2 });
      expect(result).toEqual(mockCartItem);
    });
  });
});