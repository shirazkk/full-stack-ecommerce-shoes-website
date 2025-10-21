'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/product-card';
import { Product } from '@/types';

const product: Product = {
  id: '1',
  name: 'Air Max Ultra Running Shoes',
  slug: 'air-max-ultra-running',
  description:
    'Experience ultimate comfort with our Air Max Ultra Running Shoes. Featuring advanced cushioning technology and breathable mesh upper, these shoes are designed for serious runners who demand the best. The lightweight construction and responsive sole provide exceptional energy return with every stride.',
  price: 189.99,
  sale_price: 149.99,
  brand: 'KICKZ',
  colors: ['Black', 'White', 'Blue'],
  sizes: ['7', '8', '9', '10', '11'],
  images: [
    'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ],
  stock: 50,
  is_featured: true,
  is_new: true,
  rating: 4.8,
  reviews_count: 124,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const relatedProducts: Product[] = [
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
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const discountPercentage =
    product.sale_price && product.sale_price < product.price
      ? Math.round(((product.price - product.sale_price) / product.price) * 100)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-slate-100 rounded-lg overflow-hidden"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            {product.brand && (
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                {product.brand}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">
                ${(product.sale_price || product.price).toFixed(2)}
              </span>
              {product.sale_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                </>
              )}
            </div>

            {product.is_new && <Badge className="mb-4">New Arrival</Badge>}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block font-semibold">Select Size</Label>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-semibold">Select Color</Label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-semibold">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
