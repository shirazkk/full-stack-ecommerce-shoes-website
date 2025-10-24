'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Heart, Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { addToGuestCart, isInGuestWishlist, addToGuestWishlist, removeFromGuestWishlist } from '@/lib/services/cart.service';
import { isInGuestWishlist as isInWishlist, addToGuestWishlist as addToWishlist, removeFromGuestWishlist as removeFromWishlist } from '@/lib/services/wishlist.service';

const categories = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'mens-shoes', name: "Men's Shoes", slug: 'mens-shoes' },
  { id: 'womens-shoes', name: "Women's Shoes", slug: 'womens-shoes' },
  { id: 'kids-shoes', name: "Kids' Shoes", slug: 'kids-shoes' },
  { id: 'running-shoes', name: 'Running', slug: 'running-shoes' },
  { id: 'basketball-shoes', name: 'Basketball', slug: 'basketball-shoes' },
  { id: 'casual-sneakers', name: 'Casual', slug: 'casual-sneakers' },
];

const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok', 'Asics', 'Brooks', 'Hoka'];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        
        // Category filter
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        // Search query
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        // Brand filters
        if (selectedBrands.length > 0) {
          selectedBrands.forEach(brand => params.append('brands', brand));
        }
        
        // Price range
        if (priceRange[0] > 0) {
          params.append('minPrice', priceRange[0].toString());
        }
        if (priceRange[1] < 500) {
          params.append('maxPrice', priceRange[1].toString());
        }
        
        // Sort
        const sortMapping: { [key: string]: { sortBy: string; sortOrder: string } } = {
          'newest': { sortBy: 'created_at', sortOrder: 'desc' },
          'price-low': { sortBy: 'price', sortOrder: 'asc' },
          'price-high': { sortBy: 'price', sortOrder: 'desc' },
          'rating': { sortBy: 'rating', sortOrder: 'desc' },
          'popular': { sortBy: 'reviews_count', sortOrder: 'desc' },
        };
        
        const sortConfig = sortMapping[sortBy];
        if (sortConfig) {
          params.append('sortBy', sortConfig.sortBy);
          params.append('sortOrder', sortConfig.sortOrder);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, sortBy, toast]);

  const handleWishlistToggle = (product: Product) => {
    const isWishlisted = isInWishlist(product.id);
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from Wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = (product: Product) => {
    addToGuestCart(product, product.sizes[0], product.colors[0], 1);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.brand === selectedCategory;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = product.sale_price 
      ? (product.sale_price >= priceRange[0] && product.sale_price <= priceRange[1])
      : (product.price >= priceRange[0] && product.price <= priceRange[1]);
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.sale_price || a.price) - (b.sale_price || b.price);
      case 'price-high':
        return (b.sale_price || b.price) - (a.sale_price || a.price);
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.reviews_count - a.reviews_count;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

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
                  <h3 className="text-lg font-semibold text-nike-gray-900">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
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
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={brand}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBrands([...selectedBrands, brand]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand));
                              }
                            }}
                          />
                          <label htmlFor={brand} className="text-sm text-nike-gray-700">
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
                Showing {sortedProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-nike-gray-500 text-lg">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedBrands([]);
                    setPriceRange([0, 500]);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <div className={`relative overflow-hidden ${
                          viewMode === 'grid' ? 'aspect-square' : 'h-48'
                        }`}>
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
                          <Heart className={`h-5 w-5 ${
                            isInWishlist(product.id) ? 'text-red-500 fill-current' : 'text-nike-gray-400'
                          }`} />
                        </Button>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-nike-gray-900 group-hover:text-nike-orange-500 transition-colors">
                            <Link href={`/products/${product.slug}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-nike-gray-600">{product.brand}</p>
                          
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
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
          </div>
        </div>
      </div>
    </div>
  );
}