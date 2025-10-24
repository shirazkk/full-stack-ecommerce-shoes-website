import { GET, POST } from '@/app/api/orders/route';
import { OrderService } from '@/lib/services/order.service';
import { createServerClient } from '@/lib/supabase/server';

jest.mock('@/lib/services/order.service');
jest.mock('@/lib/supabase/server');

describe('/api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return orders for authenticated user', async () => {
      const mockOrders = [
        { id: '1', user_id: 'user-1', status: 'pending' },
        { id: '2', user_id: 'user-1', status: 'completed' },
      ];

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

      (OrderService.getOrdersByUser as jest.Mock).mockResolvedValue(mockOrders);

      const request = new Request('http://localhost:3000/api/orders');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrders);
      expect(OrderService.getOrdersByUser).toHaveBeenCalledWith('user-1');
    });

    it('should return 401 for unauthenticated user', async () => {
      (createServerClient as jest.Mock).mockImplementation(() => ({
        auth: {
          getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        },
      }));

      const request = new Request('http://localhost:3000/api/orders');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('POST', () => {
    it('should create a new order', async () => {
      const mockOrder = {
        id: '1',
        user_id: 'user-1',
        status: 'pending',
        total_amount: 199.98,
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

      (OrderService.createOrder as jest.Mock).mockResolvedValue(mockOrder);

      const orderData = {
        order: {
          total_amount: 199.98,
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
        },
        items: [
          { product_id: 'prod-1', quantity: 2, price: 99.99 },
        ],
      };

      const request = new Request('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrder);
      expect(OrderService.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          total_amount: 199.98,
        }),
        orderData.items
      );
    });
  });
});