'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Order, OrderItem } from '@/types';
import Link from 'next/link';

const mockOrders: Order[] = [
  {
    id: '1',
    user_id: 'user-1',
    order_number: 'ORD-2024-001',
    status: 'delivered',
    subtotal: 240.00,
    tax: 19.20,
    shipping: 0,
    total: 259.20,
    shipping_address: {
      id: 'addr-1',
      user_id: 'user-1',
      full_name: 'John Doe',
      address_line1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'US',
      phone: '(555) 123-4567',
      is_default: true,
      created_at: new Date().toISOString(),
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-18T14:20:00Z',
    order_items: [
      {
        id: 'item-1',
        order_id: '1',
        product_id: 'prod-1',
        quantity: 1,
        size: '10',
        color: 'Black',
        price: 120.00,
        created_at: '2024-01-15T10:30:00Z',
        product: {
          id: 'prod-1',
          name: 'Nike Air Max 270',
          slug: 'nike-air-max-270',
          description: 'Experience ultimate comfort',
          price: 150.00,
          sale_price: 120.00,
          brand: 'Nike',
          colors: ['Black', 'White', 'Red'],
          sizes: ['7', '8', '9', '10', '11', '12'],
          images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'],
          stock: 25,
          is_featured: true,
          is_new: true,
          rating: 4.8,
          reviews_count: 124,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-2',
        order_id: '1',
        product_id: 'prod-2',
        quantity: 1,
        size: '9',
        color: 'White',
        price: 120.00,
        created_at: '2024-01-15T10:30:00Z',
        product: {
          id: 'prod-2',
          name: 'Nike Air Force 1',
          slug: 'nike-air-force-1',
          description: 'The basketball original',
          price: 90.00,
          brand: 'Nike',
          colors: ['White', 'Black'],
          sizes: ['7', '8', '9', '10', '11', '12'],
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
          stock: 40,
          is_featured: true,
          is_new: false,
          rating: 4.9,
          reviews_count: 200,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ],
  },
  {
    id: '2',
    user_id: 'user-1',
    order_number: 'ORD-2024-002',
    status: 'processing',
    subtotal: 150.00,
    tax: 12.00,
    shipping: 15.00,
    total: 177.00,
    shipping_address: {
      id: 'addr-1',
      user_id: 'user-1',
      full_name: 'John Doe',
      address_line1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'US',
      phone: '(555) 123-4567',
      is_default: true,
      created_at: new Date().toISOString(),
    },
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    order_items: [
      {
        id: 'item-3',
        order_id: '2',
        product_id: 'prod-3',
        quantity: 1,
        size: '11',
        color: 'Blue',
        price: 150.00,
        created_at: '2024-01-20T09:15:00Z',
        product: {
          id: 'prod-3',
          name: 'Adidas Ultraboost 22',
          slug: 'adidas-ultraboost-22',
          description: 'Incredible energy return',
          price: 190.00,
          brand: 'Adidas',
          colors: ['White', 'Black', 'Blue'],
          sizes: ['6', '7', '8', '9', '10', '11'],
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
          stock: 35,
          is_featured: true,
          is_new: false,
          rating: 4.6,
          reviews_count: 89,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ],
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-nike-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nike-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nike-gray-50">
      <div className="container-nike py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-nike-display text-4xl font-bold text-nike-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-nike-body text-nike-gray-600">
            Track your orders and view order details
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-nike-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nike-gray-900 mb-2">No orders yet</h3>
              <p className="text-nike-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild className="btn-nike-primary">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                          <p className="text-sm text-nike-gray-600">
                            Placed on {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-nike-gray-100">
                                {item.product?.images?.[0] && (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-nike-gray-900">
                                  {item.product?.name}
                                </h4>
                                <p className="text-sm text-nike-gray-600">
                                  Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                </p>
                                <p className="text-sm font-semibold text-nike-gray-900">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        {/* Order Summary */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-nike-gray-600">
                            {order.order_items?.length} item{order.order_items?.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-nike-gray-900">
                              ${order.total.toFixed(2)}
                            </div>
                            {order.shipping > 0 && (
                              <div className="text-sm text-nike-gray-600">
                                Includes ${order.shipping.toFixed(2)} shipping
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="text-sm text-nike-gray-600">
                          <p className="font-medium">Shipping to:</p>
                          <p>
                            {order.shipping_address.full_name}<br />
                            {order.shipping_address.address_line1}<br />
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
