"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetailSkeleton from "./loading";

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setProduct(null);
            return;
          }
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        const productData = data.product;

        if (productData) {
          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || "Black");
          setSelectedSize(productData.sizes?.[0] || "M");
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product. Please try again.",
          variant: "destructive",
        });
        setProduct(null);
      } finally {
        setLoading(false);
        setIsInitialLoading(false);
      }
    };
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug, toast]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        setRelatedLoading(true);
        const response = await fetch(
          `/api/relatedproducts?productId=${product.id}&categoryId=${product.category_id}&limit=4`
        );

        if (!response.ok) {
          setError("Failed to fetch related products");
          return;
        }

        const data = await response.json();
        setRelatedProducts(data.products);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setError("Failed to fetch related products");
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor) {
      toast({
        title: "Please select size and color",
        description:
          "Choose your preferred size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product, quantity, selectedSize, selectedColor);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    const isWishlisted = isInWishlist(product.id);

    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  if (isInitialLoading || loading) {
    return <ProductDetailSkeleton />;
  }

  if (!isInitialLoading && !product) {
    return (
      <div className="min-h-screen bg-nike-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-nike-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link href="/products" className="btn-nike-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nike-gray-50">
      {/* Breadcrumb */}
      <div className="container-nike py-4">
        <nav className="flex items-center space-x-2 text-sm text-nike-gray-600">
          <Link href="/" className="hover:text-nike-orange-500">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-nike-orange-500">
            Products
          </Link>
          <span>/</span>
          <span className="text-nike-gray-900">{product?.name}</span>
        </nav>
      </div>

      <div className="container-nike py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square relative overflow-hidden rounded-2xl bg-white"
            >
              <Image
                src={product?.images[selectedImage] || "/placeholder.png"}
                alt={product?.name || "Product Image"}
                fill
                className="object-cover"
                priority
              />
              {product?.is_new && (
                <Badge className="absolute top-4 left-4 bg-nike-orange-500 text-white">
                  New
                </Badge>
              )}
              {product?.sale_price && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product?.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-nike-orange-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-nike-display text-3xl font-bold text-nike-gray-900">
                  {product?.name}
                </h1>
                {product?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={`transition-colors ${
                      isInWishlist(product?.id)
                        ? "text-red-500 hover:text-red-600"
                        : "text-nike-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isInWishlist(product?.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product?.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-nike-gray-600 ml-2">
                    {product?.rating} ({product?.reviews_count} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {product?.sale_price ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-nike-gray-900">
                      ${product.sale_price}
                    </span>
                    <span className="text-xl text-nike-gray-500 line-through">
                      ${product.price}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {Math.round(
                        ((product.price - product.sale_price) / product.price) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-nike-gray-900">
                    ${product?.price}
                  </span>
                )}
              </div>

              <p className="text-nike-body text-nike-gray-700 leading-relaxed">
                {product?.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-nike-gray-900 mb-3">
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product?.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className={`transition-all ${
                        selectedColor === color
                          ? "bg-nike-orange-500 text-white"
                          : "border-nike-gray-300 text-nike-gray-700 hover:border-nike-orange-500"
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-nike-gray-900 mb-3">
                  Size
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {product?.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`transition-all ${
                        selectedSize === size
                          ? "bg-nike-orange-500 text-white"
                          : "border-nike-gray-300 text-nike-gray-700 hover:border-nike-orange-500"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-nike-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= (product?.stock ?? 0)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-nike-gray-600 mt-2">
                  {product?.stock} {product?.stock === 1 ? "item" : "items"} in
                  stock
                </p>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={
                  product?.stock === 0 ||
                  isAddingToCart ||
                  !selectedSize ||
                  !selectedColor
                }
                className="w-full btn-nike-primary text-lg py-6"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${product?.sale_price || product?.price}
                  </>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-nike-gray-200">
                <div className="flex items-center space-x-2 text-sm text-nike-gray-600">
                  <Truck className="h-5 w-5 text-nike-orange-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-nike-gray-600">
                  <Shield className="h-5 w-5 text-nike-orange-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-nike-gray-600">
                  <RefreshCw className="h-5 w-5 text-nike-orange-500" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-nike-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <Skeleton className="h-64 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : relatedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No Related products available</p>
              </div>
            ) : (
              relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
