"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Order, PaginationData } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasMore: true,
  });

  const fetchOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?page=${page}&limit=3`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data.orders);

      // Update pagination
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      });
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
              <h3 className="text-lg font-semibold text-nike-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-nike-gray-600 mb-6">
                You haven&apos;t placed any orders yet. Start shopping to see
                your orders here.
              </p>
              <Button asChild className="btn-nike-primary">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 ">
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
                          <CardTitle className="text-lg">
                            Order #{order.order_number}
                          </CardTitle>
                          <p className="text-sm text-nike-gray-600">
                            Placed on{" "}
                            {new Date(order.created_at).toLocaleDateString()}
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
                            <div
                              key={item.id}
                              className="flex items-center space-x-4"
                            >
                              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-nike-gray-100">
                                {item.product?.images?.[0] && (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-nike-gray-900">
                                  {item.product?.name}
                                </h4>
                                <p className="text-sm text-nike-gray-600">
                                  Size: {item.size} • Color: {item.color} • Qty:{" "}
                                  {item.quantity}
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
                            {order.order_items?.length} item
                            {order.order_items?.length !== 1 ? "s" : ""}
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
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-nike-gray-700 text-sm">
                          <div className="flex items-center mb-2">
                            <Truck className="w-5 h-5 text-nike-orange-500 mr-2" />
                            <span className="font-medium text-gray-900">
                              Shipping Information
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p>Name: {order.shipping_address.full_name}</p>
                            <p>
                              Address1: {order.shipping_address.address_line1}
                            </p>
                            {order.shipping_address.address_line2 && (
                              <p>
                                Address2 {order.shipping_address.address_line2}
                              </p>
                            )}
                            <p>
                              City: {order.shipping_address.city}, State:{" "}
                              {order.shipping_address.state} Postal Code:{" "}
                              {order.shipping_address.postal_code}
                            </p>
                            <p className="text-sm text-gray-500">
                              Country: {order.shipping_address.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                onClick={() => fetchOrders(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                ← Previous
              </Button>

              <span className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <Button
                onClick={() => fetchOrders(pagination.currentPage + 1)}
                disabled={!pagination.hasMore}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
