"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-nike-gray-50 py-8">
      <div className="container-nike">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-white rounded-2xl overflow-hidden"
            >
              <Skeleton className="w-full h-full" />
            </motion.div>

            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title + Wishlist */}
            <div className="flex justify-between items-start">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Color */}
            <div>
              <Skeleton className="h-6 w-20 mb-3" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-16 rounded-md" />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <Skeleton className="h-6 w-16 mb-3" />
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-md" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Skeleton className="h-6 w-24 mb-3" />
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
              <Skeleton className="h-4 w-32 mt-2" />
            </div>

            {/* Add to Cart */}
            <Skeleton className="h-14 w-full rounded-xl mt-6" />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-nike-gray-200">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-16">
          <Skeleton className="h-8 w-1/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                <Skeleton className="h-64 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
