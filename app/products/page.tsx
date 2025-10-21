'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const allProducts: Product[] = [
  {
    id: '1',
    name: 'Air Max Ultra Running Shoes',
    slug: 'air-max-ultra-running',
    description: 'Premium running shoes with maximum comfort',
    price: 189.99,
    sale_price: 149.99,
    brand: 'KICKZ',
    colors: ['Black', 'White', 'Blue'],
    sizes: ['7', '8', '9', '10', '11'],
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    stock: 50,
    is_featured: true,
    is_new: true,
    rating: 4.8,
    reviews_count: 124,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Leather Sneakers',
    slug: 'classic-leather-sneakers',
    description: 'Timeless design meets modern comfort',
    price: 129.99,
    brand: 'KICKZ',
    colors: ['White', 'Black', 'Brown'],
    sizes: ['7', '8', '9', '10', '11'],
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    stock: 35,
    is_featured: true,
    is_new: false,
    rating: 4.6,
    reviews_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sport Pro Basketball Shoes',
    slug: 'sport-pro-basketball',
    description: 'High-performance shoes for the court',
    price: 159.99,
    sale_price: 139.99,
    brand: 'KICKZ',
    colors: ['Red', 'Black', 'White'],
    sizes: ['8', '9', '10', '11', '12'],
    images: [
      'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    stock: 28,
    is_featured: true,
    is_new: false,
    rating: 4.9,
    reviews_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Urban Street Style Sneakers',
    slug: 'urban-street-style',
    description: 'Make a statement with every step',
    price: 139.99,
    brand: 'KICKZ',
    colors: ['Grey', 'Black', 'Navy'],
    sizes: ['7', '8', '9', '10', '11'],
    images: [
      'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    stock: 42,
    is_featured: true,
    is_new: true,
    rating: 4.7,
    reviews_count: 98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Comfort Walk Casual Shoes',
    slug: 'comfort-walk-casual',
    description: 'All-day comfort for everyday wear',
    price: 99.99,
    brand: 'KICKZ',
    colors: ['Tan', 'Black', 'Grey'],
    sizes: ['7', '8', '9', '10', '11'],
    images: [
      'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    stock: 60,
    is_featured: false,
    is_new: false,
    rating: 4.5,
    reviews_count: 72,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Performance Training Shoes',
    slug: 'performance-training',
    description: 'Built for intense workouts',
    price: 119.99,
    sale_price: 99.99,
    brand: 'KICKZ',
    colors: ['Black', 'Red', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    images: [
      'https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    stock: 45,
    is_featured: false,
    is_new: true,
    rating: 4.8,
    reviews_count: 110,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const brands = ['KICKZ', 'Nike', 'Adidas', 'Puma', 'Reebok'];
const sizes = ['7', '8', '9', '10', '11', '12'];
const colors = ['Black', 'White', 'Red', 'Blue', 'Grey', 'Brown'];

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  const toggleFilter = (value: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={200}
          step={10}
          className="mt-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Brand</Label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand}`}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
            />
            <label
              htmlFor={`brand-${brand}`}
              className="text-sm cursor-pointer"
            >
              {brand}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label>Size</Label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Color</Label>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleFilter(color, selectedColors, setSelectedColors)}
              />
              <label
                htmlFor={`color-${color}`}
                className="text-sm cursor-pointer"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of premium footwear
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground">
                {allProducts.length} Products
              </p>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
