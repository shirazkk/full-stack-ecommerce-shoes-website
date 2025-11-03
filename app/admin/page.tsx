"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  usersChange: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    usersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setStats({
        totalRevenue: 125430.5,
        totalOrders: 1247,
        totalProducts: 156,
        totalUsers: 892,
        revenueChange: 12.5,
        ordersChange: 8.2,
        productsChange: 3.1,
        usersChange: 15.7,
      });

      setRecentOrders([
        {
          id: "1",
          orderNumber: "ORD-2024-001",
          customer: "John Doe",
          amount: 259.2,
          status: "delivered",
          date: "2024-01-18T14:20:00Z",
        },
        {
          id: "2",
          orderNumber: "ORD-2024-002",
          customer: "Jane Smith",
          amount: 177.0,
          status: "processing",
          date: "2024-01-20T09:15:00Z",
        },
        {
          id: "3",
          orderNumber: "ORD-2024-003",
          customer: "Mike Johnson",
          amount: 320.5,
          status: "shipped",
          date: "2024-01-19T16:30:00Z",
        },
        {
          id: "4",
          orderNumber: "ORD-2024-004",
          customer: "Sarah Wilson",
          amount: 145.75,
          status: "pending",
          date: "2024-01-21T11:45:00Z",
        },
      ]);

      setTopProducts([
        {
          id: "1",
          name: "Nike Air Max 270",
          sales: 45,
          revenue: 5400.0,
          image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
        },
        {
          id: "2",
          name: "Adidas Ultraboost 22",
          sales: 38,
          revenue: 7220.0,
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
        },
        {
          id: "3",
          name: "Nike Air Force 1",
          sales: 52,
          revenue: 4680.0,
          image:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-nike-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-nike-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-nike-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-nike-gray-600 mt-2">
          Welcome to your admin dashboard. Here&apos;s what&apos;s happening
          with your store.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nike-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {stats.revenueChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stats.revenueChange > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(stats.revenueChange)}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nike-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  {stats.totalOrders.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {stats.ordersChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stats.ordersChange > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(stats.ordersChange)}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nike-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  {stats.totalProducts.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {stats.productsChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stats.productsChange > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(stats.productsChange)}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nike-gray-600">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {stats.usersChange > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${
                      stats.usersChange > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(stats.usersChange)}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-nike-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-nike-gray-900 truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-nike-gray-600">
                        {order.customer}
                      </p>
                      <p className="text-xs text-nike-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                      <span className="font-semibold text-nike-gray-900">
                        ${order.amount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-nike-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-nike-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-nike-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-nike-gray-600">
                        <span>{product.sales} sales</span>
                        <span>•</span>
                        <span>${product.revenue.toFixed(2)} revenue</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-nike-gray-900">
                        {Math.floor(Math.random() * 2) + 4}.
                        {Math.floor(Math.random() * 10)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                asChild
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Link href="/admin/products/new">
                  <Package className="h-6 w-6" />
                  <span>Add New Product</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Link href="/admin/orders">
                  <ShoppingCart className="h-6 w-6" />
                  <span>Manage Orders</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Link href="/admin/analytics">
                  <Eye className="h-6 w-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
