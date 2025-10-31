"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

// Categories and brands will be fetched from API

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("created_at");

  // Read URL parameters and set initial state
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const brands = searchParams.getAll("brands");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
    if (brands.length > 0) {
      setSelectedBrands(brands);
    }
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
    if (sort) {
      setSortBy(sort);
    }
  }, [searchParams]);

  // Fetch categories and brands
  const fetchCategoriesAndBrands = useCallback(async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch("/api/categories");
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories([
          { id: "all", name: "All Products", slug: "all" },
          ...categoriesData.categories.map((cat: any) => ({
            id: cat.slug,
            name: cat.name,
            slug: cat.slug,
          })),
        ]);
      }

      // Fetch brands
      const brandsResponse = await fetch("/api/brands");
      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json();
        setBrands(brandsData.brands);
      }
    } catch (error) {
      console.error("Error fetching categories and brands:", error);
    }
  }, []);

  // Fetch categories and brands on mount
  useEffect(() => {
    fetchCategoriesAndBrands();
  }, [fetchCategoriesAndBrands]);

  // Create debounced fetch function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      // Category filter
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      // Search query
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      // Brand filters
      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brand) => params.append("brands", brand));
      }

      // Price range
      if (priceRange[0] > 0) {
        params.append("minPrice", priceRange[0].toString());
      }
      if (priceRange[1] < 500) {
        params.append("maxPrice", priceRange[1].toString());
      }

      // Sort
      const sortMapping: {
        [key: string]: { sortBy: string; sortOrder: string };
      } = {
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

      // pagination params
      params.append("limit", String(limit));
      params.append("offset", String((page - 1) * limit));

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
      setTotal(data.total ?? data.count ?? 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    priceRange,
    sortBy,
    toast,
    page,
    limit,
  ]);

  // Create debounced version
  const debouncedFetch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchProducts, 300);
    };
  }, [fetchProducts]);

  // Fetch products from API with debouncing
  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    searchQuery,
    selectedBrands,
    priceRange,
    sortBy,
    limit,
  ]);

  const handleWishlistToggle = async (product: Product) => {
    const isWishlisted = isInWishlist(product.id);

    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(
      product,
      1,
      product.sizes?.[0] || "M",
      product.colors?.[0] || "Black"
    );
  };

  // Products are already filtered and sorted by the API
  const sortedProducts = products;

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
          <h1 className="text-nike-display text-4xl font-bold text-nike-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-nike-body text-nike-gray-600">
            Discover our complete collection of premium footwear
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
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
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Hide" : "Show"} Filters
                  </Button>
                </div>

                <div
                  className={`space-y-6 ${
                    showFilters ? "block" : "hidden lg:block"
                  }`}
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
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                              if (checked) {
                                setSelectedBrands([...selectedBrands, brand]);
                              } else {
                                setSelectedBrands(
                                  selectedBrands.filter((b) => b !== brand)
                                );
                              }
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
                      max={500}
                      min={0}
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
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                Showing {Math.min((page - 1) * limit + 1, total || 0)} -{" "}
                {Math.min(page * limit, total || 0)} of {total} products
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
            {sortedProducts.length === 0 ? (
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
                {sortedProducts.map((product, index) => (
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
                        <div className="space-y-2">
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
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            {/* Pagination controls */}
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
