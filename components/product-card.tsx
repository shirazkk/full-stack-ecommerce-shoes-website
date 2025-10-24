'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addToCart(product, 1, product.sizes?.[0] || 'M', product.colors?.[0] || 'Black');
  };

  const displayPrice = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="card-nike overflow-hidden group-hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-square overflow-hidden bg-nike-gray-50">
            {product.images && product.images.length > 0 ? (
              <>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.images[1] && (
                  <Image
                    src={product.images[1]}
                    alt={product.name}
                    fill
                    className="object-cover transition-all duration-500 opacity-0 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-nike-gray-400">
                <Zap className="h-12 w-12" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="badge-nike-primary">New</Badge>
                </motion.div>
              )}
              {hasDiscount && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="badge-nike-warning">-{discountPercentage}%</Badge>
                </motion.div>
              )}
              {product.stock === 0 && (
                <Badge className="badge-nike-error">Out of Stock</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 right-4"
            >
              <Button
                variant="secondary"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                onClick={handleWishlistToggle}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isWishlisted ? 'fill-nike-orange-500 text-nike-orange-500' : 'text-nike-gray-600'
                  }`}
                />
              </Button>
            </motion.div>

            {/* Quick Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 20 
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <Button
                className="w-full btn-nike-primary text-sm py-3"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </motion.div>
          </div>

          <div className="p-6 space-y-3">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-nike-gray-500 uppercase tracking-wider font-semibold">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h3 className="text-nike-display text-lg font-semibold line-clamp-2 min-h-[3.5rem] group-hover:text-nike-orange-500 transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-nike-display text-xl font-bold text-nike-black">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-nike-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-nike-orange-400 text-nike-orange-400'
                          : 'text-nike-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-nike-gray-600 font-medium">
                  {product.rating.toFixed(1)} ({product.reviews_count})
                </span>
              </div>
            )}

            {/* Colors Preview */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-nike-gray-500 uppercase tracking-wide">Colors:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 3).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-nike-gray-200"
                      style={{ backgroundColor: getColorValue(color) }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-nike-gray-500">+{product.colors.length - 3}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Helper function to get color values
function getColorValue(color: string): string {
  const colorMap: { [key: string]: string } = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Navy': '#1E3A8A',
    'Red': '#DC2626',
    'Blue': '#2563EB',
    'Grey': '#6B7280',
    'Green': '#059669',
    'Brown': '#92400E',
    'Pink': '#EC4899',
    'Yellow': '#F59E0B',
    'Orange': '#F97316',
    'Purple': '#7C3AED',
  };
  return colorMap[color] || '#6B7280';
}
