import { OrderService } from '@/lib/services/order.service';
import { supabase } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order with items', async () => {
      const mockOrder = {
        id: '1',
        user_id: 'user-1',
        status: 'pending',
        total_amount: 100,
      };

      const mockItems = [
        { product_id: 'prod-1', quantity: 1, price: 50 },
        { product_id: 'prod-2', quantity: 1, price: 50 },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockOrder, error: null }),
      });

      const result = await OrderService.createOrder({
        user_id: 'user-1',
        status: 'pending',
        total_amount: 100,
        shipping_address: {
          full_name: 'John Doe',
          address_line1: '123 Main St',
          city: 'Example City',
          state: 'EX',
          postal_code: '12345',
          country: 'US',
          phone: '1234567890',
        },
        payment_intent_id: 'pi_123',
        payment_status: 'pending',
      }, mockItems);

      expect(result).toEqual(mockOrder);
    });
  });

  describe('getOrdersByUser', () => {
    it('should fetch all orders for a user', async () => {
      const mockOrders = [
        { id: '1', user_id: 'user-1', status: 'pending' },
        { id: '2', user_id: 'user-1', status: 'completed' },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockOrders, error: null }),
      });

      const result = await OrderService.getOrdersByUser('user-1');
      expect(result).toEqual(mockOrders);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const mockOrder = {
        id: '1',
        status: 'processing',
      };

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockOrder, error: null }),
      });

      const result = await OrderService.updateOrderStatus('1', 'processing');
      expect(result).toEqual(mockOrder);
    });
  });
});