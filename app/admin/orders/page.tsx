'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal,
  ArrowUpDown,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: 'John Doe',
    email: 'john@example.com',
    amount: 259.20,
    status: 'delivered',
    date: '2024-01-18T14:20:00Z',
    items: 2,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    amount: 177.00,
    status: 'processing',
    date: '2024-01-20T09:15:00Z',
    items: 1,
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    amount: 320.50,
    status: 'shipped',
    date: '2024-01-19T16:30:00Z',
    items: 3,
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: 'Sarah Wilson',
    email: 'sarah@example.com',
    amount: 145.75,
    status: 'pending',
    date: '2024-01-21T11:45:00Z',
    items: 1,
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: 'David Brown',
    email: 'david@example.com',
    amount: 89.99,
    status: 'cancelled',
    date: '2024-01-17T08:30:00Z',
    items: 1,
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customer: 'Lisa Davis',
    email: 'lisa@example.com',
    amount: 210.00,
    status: 'delivered',
    date: '2024-01-16T13:15:00Z',
    items: 2,
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'customer':
          aValue = a.customer;
          bValue = b.customer;
          break;
        default:
          aValue = a.orderNumber;
          bValue = b.orderNumber;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, sortBy, sortOrder]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-nike-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-nike-gray-200 rounded"></div>
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-nike-gray-900">Order Management</h1>
          <p className="text-nike-gray-600 mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nike-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="orderNumber">Order Number</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-nike-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-nike-gray-900">Order</th>
                    <th className="text-left py-3 px-4 font-semibold text-nike-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-nike-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-nike-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-nike-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-nike-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-nike-gray-100 hover:bg-nike-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-nike-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-nike-gray-600">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-nike-gray-900">{order.customer}</p>
                          <p className="text-sm text-nike-gray-600">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={statusConfig[order.status].color}>
                          {statusConfig[order.status].label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-nike-gray-900">
                          ${order.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-nike-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-nike-gray-500">No orders found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
