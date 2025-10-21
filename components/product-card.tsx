'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 mb-3">
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">-{discountPercentage}%</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>

          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </p>
          )}
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-yellow-500">★</span>
              <span>{product.rating.toFixed(1)}</span>
              <span>({product.reviews_count})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
