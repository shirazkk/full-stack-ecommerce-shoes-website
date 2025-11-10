"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  RefreshCw,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  date: string;
  items: number;
  shippingCustomer?: {
    name: string;
    email: string;
  };
  user?: Profile;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Fetch orders + users
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      // Map orders and merge user info
      const formattedOrders: Order[] = data.orders.map((o: any) => {
        const user = data.users.find((u: any) => u.id === o.user_id);

        return {
          id: o.id,
          orderNumber: o.order_number || `ORD-${o.id.slice(0, 8)}`,
          amount: o.total || o.amount || 0,
          status: o.status || "pending",
          date: o.created_at,
          items: Array.isArray(o.order_items) ? o.order_items.length : 0,
          shippingCustomer: {
            name: o.shipping_address?.full_name || "Unknown",
            email: o.shipping_address?.email || "N/A",
          },
          user: user
            ? {
                id: user.id,
                full_name: user.full_name || "Unknown",
                email: user.email || "N/A",
                avatar_url: user.avatar_url || "",
                phone: user.phone || "",
              }
            : undefined,
        };
      });

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast({
        title: "Error loading orders",
        description: "Please check your API or Supabase setup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  // Filter & sort
  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.shippingCustomer?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.shippingCustomer?.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.user?.full_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "customer":
          aValue = a.shippingCustomer?.name || "";
          bValue = b.shippingCustomer?.name || "";
          break;
        case "items":
          aValue = a.items;
          bValue = b.items;
          break;
        default:
          aValue = a.orderNumber;
          bValue = b.orderNumber;
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });

    setFilteredOrders(filtered);
  }, [orders, searchQuery, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-nike-gray-200 border-t-nike-orange-500 rounded-full"></div>
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
          <h1 className="text-3xl font-bold text-nike-gray-900">
            Order Management
          </h1>
          <p className="text-nike-gray-600 mt-2">
            Manage and track all customer orders
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-nike-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                <SelectItem value="items">Items</SelectItem>
                <SelectItem value="orderNumber">Order Number</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nike-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Order</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Customer (Shipping)
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Items</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-nike-gray-50"
                  >
                    <td className="py-4 px-4 font-medium">
                      {order.orderNumber}
                    </td>

                    <td className="py-4 px-4">
                      <p>{order.shippingCustomer?.name}</p>
                      <p className="text-sm text-nike-gray-600">
                        {order.shippingCustomer?.email}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      {order.user ? (
                        <div className="flex items-center space-x-2">
                          {order.user.avatar_url && (
                            <img
                              src={order.user.avatar_url}
                              alt={order.user.full_name}
                              className="h-6 w-6 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              {order.user.full_name}
                            </p>
                            <p className="text-sm text-nike-gray-600">
                              {order.user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No user info</p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <Badge
                        className={
                          statusConfig[order.status]?.color ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 font-semibold">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">{order.items}</td>
                    <td className="py-4 px-4 text-nike-gray-600">
                      {new Date(order.date).toLocaleString()}
                    </td>

                    <td className="py-4 px-4 flex space-x-2">
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
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-nike-gray-500">
                No orders found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </Button>
              <span className="flex items-center px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                size="sm"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
