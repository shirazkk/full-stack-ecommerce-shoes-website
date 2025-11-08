"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Download,
  RefreshCw,
  Package,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactive", color: "bg-red-100 text-red-800" },
  draft: { label: "Draft", color: "bg-yellow-100 text-yellow-800" },
};

const getStatusInfo = (status?: string) => {
  if (!status) return { label: "Unknown", color: "bg-gray-100 text-gray-800" };
  return (
    statusConfig[status as keyof typeof statusConfig] ?? {
      label: "Unknown",
      color: "bg-gray-100 text-gray-800",
    }
  );
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleting, setDeleting] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  // Fetch products with pagination and optional search/category/sort params.

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("limit", String(limit));
      params.set("offset", String((page - 1) * limit));
      if (searchQuery) params.set("search", searchQuery);
      if (categoryFilter && categoryFilter !== "all")
        params.set("category", categoryFilter);
      // map sortBy to backend-supported field names
      const sortMap: Record<string, string> = {
        name: "name",
        price: "price",
        created: "created_at",
        rating: "rating",
      };
      if (sortBy) params.set("sortBy", sortMap[sortBy] || sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);

      const url = `/api/products?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();

      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
      setTotal(data.total ?? 0);
      setLimit(data.limit ?? 12);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setFilteredProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, searchQuery, categoryFilter, sortBy, sortOrder]);

  // Reset to first page when filters/search/sort change to avoid empty pages
  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter, sortBy, sortOrder, limit]);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          (product.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (product.brand?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (product.category?.name.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category?.slug === categoryFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "price":
          aValue = a.sale_price || a.price;
          bValue = b.sale_price || b.price;
          break;
        case "stock":
          aValue = a.stock;
          bValue = b.stock;
          break;
        // case "sales":
        //   aValue = a.s;
        //   bValue = b.sales;
        //   break;
        case "created":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

  // setProducts((prev) => prev.filter((product) => product.id !== productId));
  const handleDelete = async (product: Product) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete product");
      }

      toast({
        title: "🗑️ Product Deleted",
        description: `${product.name} has been removed successfully.`,
      });

      router.push("/admin");
    } catch (error: any) {
      console.error("Delete Error:", error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (!products || products.length === 0) return;

    // Map products to CSV rows
    const headers = [
      "ID",
      "Name",
      "Description",
      "Brand",
      "Category",
      "Colors",
      "Is-Featured",
      "Is-New",
      "Status",
      "Price",
      "Stock",
    ];
    const rows = products.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.description || ""}"`,
      `"${p.brand}"`,
      `"${p.category_id || ""}"`,
      `"${p.colors || ""}"`,
      `"${p.is_featured || ""}"`,
      `"${p.is_new || ""}"`,
      p.status,
      p.price,
      p.stock,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "products_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const handleStatusChange = (productId: string, newStatus: string) => {
  //   setProducts((prev) =>
  //     prev.map((product) =>
  //       product.id === productId
  //         ? { ...product, status: newStatus as any }
  //         : product
  //     )
  //   );
  // };

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
          <h1 className="text-3xl font-bold text-nike-gray-900">
            Product Management
          </h1>
          <p className="text-nike-gray-600 mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchProducts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild className="btn-nike-primary">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
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
                    placeholder="Search products..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Men's Shoes">
                      Men&apos;s Shoes
                    </SelectItem>
                    <SelectItem value="Women's Shoes">
                      Women&apos;s Shoes
                    </SelectItem>
                    <SelectItem value="Running Shoes">Running Shoes</SelectItem>
                    <SelectItem value="Casual Sneakers">
                      Casual Sneakers
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="absolute top-1/2 left-1/2 ">
                      <Badge className={getStatusInfo(product.status).color}>
                        {getStatusInfo(product.status).label}
                      </Badge>
                    </div>
                    {product.sale_price && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500 text-white">Sale</Badge>
                      </div>
                    )}
                    {product.is_new && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-green-500 text-white">New</Badge>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/products/${product.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/admin/products/${product.slug}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-nike-gray-900 group-hover:text-nike-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-nike-gray-600">
                      {product.brand}
                    </p>
                    <p className="text-xs text-nike-gray-500">
                      {product.category?.name}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {product.sale_price ? (
                          <>
                            <span className="text-lg font-bold text-nike-gray-900">
                              ${product.sale_price}
                            </span>
                            <span className="text-sm text-nike-gray-500 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-nike-gray-900">
                            ${product.price}
                          </span>
                        )}
                      </div>
                      <div className="text-right text-sm text-nike-gray-600">
                        <p>Stock: {product.stock}</p>
                        {/* <p>Sales: {product.sales}</p> */}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-nike-gray-100">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.slug}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* <Select
                        value={product.status}
                        onValueChange={(value) =>
                          handleStatusChange(product.id, value)
                        }
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-nike-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-nike-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-nike-gray-600 mb-6">
                No products match your current filters. Try adjusting your
                search criteria.
              </p>
              <Button asChild>
                <Link href="/admin/products/new">Add Your First Product</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination controls */}
        {total > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-nike-gray-600">
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
              of {total} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1 px-2">
                {Array.from({
                  length: Math.max(1, Math.ceil(total / limit)),
                }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={pageNum === page ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
