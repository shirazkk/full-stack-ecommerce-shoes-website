'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    chart: Array<{ date: string; value: number }>;
  };
  orders: {
    total: number;
    change: number;
    chart: Array<{ date: string; value: number }>;
  };
  customers: {
    total: number;
    change: number;
    chart: Array<{ date: string; value: number }>;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    image: string;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData({
        revenue: {
          total: 125430.50,
          change: 12.5,
          chart: [
            { date: '2024-01-01', value: 12000 },
            { date: '2024-01-02', value: 15000 },
            { date: '2024-01-03', value: 18000 },
            { date: '2024-01-04', value: 14000 },
            { date: '2024-01-05', value: 16000 },
            { date: '2024-01-06', value: 19000 },
            { date: '2024-01-07', value: 22000 },
          ],
        },
        orders: {
          total: 1247,
          change: 8.2,
          chart: [
            { date: '2024-01-01', value: 45 },
            { date: '2024-01-02', value: 52 },
            { date: '2024-01-03', value: 48 },
            { date: '2024-01-04', value: 61 },
            { date: '2024-01-05', value: 55 },
            { date: '2024-01-06', value: 67 },
            { date: '2024-01-07', value: 73 },
          ],
        },
        customers: {
          total: 892,
          change: 15.7,
          chart: [
            { date: '2024-01-01', value: 12 },
            { date: '2024-01-02', value: 18 },
            { date: '2024-01-03', value: 15 },
            { date: '2024-01-04', value: 22 },
            { date: '2024-01-05', value: 19 },
            { date: '2024-01-06', value: 25 },
            { date: '2024-01-07', value: 28 },
          ],
        },
        topProducts: [
          {
            id: '1',
            name: 'Nike Air Max 270',
            sales: 45,
            revenue: 5400.00,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
          },
          {
            id: '2',
            name: 'Adidas Ultraboost 22',
            sales: 38,
            revenue: 7220.00,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
          },
          {
            id: '3',
            name: 'Nike Air Force 1',
            sales: 52,
            revenue: 4680.00,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop',
          },
          {
            id: '4',
            name: 'Converse Chuck 70',
            sales: 67,
            revenue: 5360.00,
            image: 'https://images.unsplash.com/photo-1032118-pexels-photo-1032118?w=100&h=100&fit=crop',
          },
        ],
        salesByCategory: [
          { category: "Men's Shoes", sales: 45, percentage: 35 },
          { category: "Women's Shoes", sales: 38, percentage: 30 },
          { category: 'Running Shoes', sales: 25, percentage: 20 },
          { category: 'Casual Sneakers', sales: 20, percentage: 15 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-nike-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-nike-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-nike-gray-900">Analytics Dashboard</h1>
          <p className="text-nike-gray-600 mt-2">
            Track your store's performance and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nike-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  ${data.revenue.total.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {data.revenue.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${data.revenue.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.revenue.change)}%
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
                <p className="text-sm font-medium text-nike-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  {data.orders.total.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {data.orders.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${data.orders.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.orders.change)}%
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
                <p className="text-sm font-medium text-nike-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-nike-gray-900">
                  {data.customers.total.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {data.customers.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${data.customers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(data.customers.change)}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-nike-orange-500" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-nike-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-nike-gray-400 mx-auto mb-2" />
                  <p className="text-nike-gray-600">Chart visualization would go here</p>
                  <p className="text-sm text-nike-gray-500">Integration with Recharts or similar library</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-nike-orange-500" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.salesByCategory.map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-nike-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm text-nike-gray-600">
                        {category.sales} sales ({category.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-nike-gray-200 rounded-full h-2">
                      <div
                        className="bg-nike-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-nike-orange-500" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-nike-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-nike-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-nike-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-nike-gray-600">
                      {product.sales} sales • ${product.revenue.toFixed(2)} revenue
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-nike-gray-900">
                      #{index + 1}
                    </div>
                    <div className="text-sm text-nike-gray-600">
                      Top Seller
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
