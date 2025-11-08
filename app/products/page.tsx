"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Heart,
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Product } from "@/types";

const sortOptions = [
  { value: "created_at", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews_count", label: "Most Popular" },
  { value: "name", label: "Name: A to Z" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("created_at");

  // Sync filters with URL
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("search") || "");
    setSelectedBrands(searchParams.getAll("brands") || []);
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    if (min && max) setPriceRange([parseInt(min), parseInt(max)]);
    setSortBy(searchParams.get("sort") || "created_at");
  }, [searchParams.toString()]);

  // Fetch categories and brands
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        setCategories([
          { id: "all", name: "All Products", slug: "all" },
          ...catData.categories.map((c: any) => ({
            id: c.slug,
            name: c.name,
            slug: c.slug,
          })),
        ]);
        setBrands(brandData.brands);
      } catch (error) {
        console.error("Failed to fetch categories/brands", error);
      }
    }
    fetchData();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (searchQuery) params.append("search", searchQuery);
        selectedBrands.forEach((b) => params.append("brands", b));
        if (priceRange[0] > 0) params.append("minPrice", String(priceRange[0]));
        if (priceRange[1] < 500)
          params.append("maxPrice", String(priceRange[1]));

        const sortMapping: Record<
          string,
          { sortBy: string; sortOrder: string }
        > = {
          created_at: { sortBy: "created_at", sortOrder: "desc" },
          price: { sortBy: "price", sortOrder: "asc" },
          "price-desc": { sortBy: "price", sortOrder: "desc" },
          rating: { sortBy: "rating", sortOrder: "desc" },
          reviews_count: { sortBy: "reviews_count", sortOrder: "desc" },
          name: { sortBy: "name", sortOrder: "asc" },
        };
        const sortConfig = sortMapping[sortBy];
        if (sortConfig) {
          params.append("sortBy", sortConfig.sortBy);
          params.append("sortOrder", sortConfig.sortOrder);
        }

        params.append("limit", String(limit));
        params.append("offset", String((page - 1) * limit));

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        setProducts(data.products || []);
        setTotal(data.total ?? data.count ?? 0);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    priceRange,
    sortBy,
    page,
    limit,
    toast,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, sortBy]);

  const handleWishlistToggle = async (product: Product) => {
    if (isInWishlist(product.id)) await removeFromWishlist(product.id);
    else await addToWishlist(product);
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(
      product,
      1,
      product.sizes?.[0] || "M",
      product.colors?.[0] || "Black"
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-nike-orange-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-nike-gray-50">
      <div className="container-nike py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-nike-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-nike-gray-600">
            Discover our complete collection of premium footwear
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-80">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-nike-gray-900">
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />{" "}
                    {showFilters ? "Hide" : "Show"} Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Reset state
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedBrands([]);
                      setPriceRange([0, 500]);
                      setSortBy("created_at");
                      router.push("/products");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
                <div
                  className={`${
                    showFilters ? "block" : "hidden lg:block"
                  } space-y-6`}
                >
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium text-nike-gray-700 mb-2 block">
                      Search
                    </label>
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
                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-nike-gray-700 mb-2 block">
                      Category
                    </label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Brand */}
                  <div>
                    <label className="text-sm font-medium text-nike-gray-700 mb-2 block">
                      Brand
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={(checked) => {
                              setSelectedBrands(
                                checked
                                  ? [...selectedBrands, brand]
                                  : selectedBrands.filter((b) => b !== brand)
                              );
                            }}
                          />
                          <label
                            htmlFor={brand}
                            className="text-sm text-nike-gray-700"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-nike-gray-700 mb-2 block">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium text-nike-gray-700 mb-2 block">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-nike-gray-600">
                Showing {Math.min((page - 1) * limit + 1, total)} -{" "}
                {Math.min(page * limit, total)} of {total} products
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-nike-gray-500 text-lg">
                  No products found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedBrands([]);
                    setPriceRange([0, 500]);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <div
                          className={`relative overflow-hidden ${
                            viewMode === "grid" ? "aspect-square" : "h-48"
                          }`}
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.is_new && (
                            <Badge className="absolute top-3 left-3 bg-nike-orange-500 text-white">
                              New
                            </Badge>
                          )}
                          {product.sale_price && (
                            <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                              Sale
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleWishlistToggle(product)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isInWishlist(product.id)
                                ? "text-red-500 fill-current"
                                : "text-nike-gray-400"
                            }`}
                          />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-nike-gray-900 group-hover:text-nike-orange-500 transition-colors">
                          <Link href={`/products/${product.slug}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-nike-gray-600">
                          {product.brand}
                        </p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-nike-gray-500 ml-1">
                            ({product.reviews_count})
                          </span>
                        </div>
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
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="btn-nike-primary"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-nike-gray-600">
                  Showing {Math.min((page - 1) * limit + 1, total)} -{" "}
                  {Math.min(page * limit, total)} of {total}
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
                    onClick={() =>
                      setPage((p) => Math.min(Math.ceil(total / limit), p + 1))
                    }
                    disabled={page * limit >= total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
