"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const NewArrivals = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch(
          "/api/products?sortBy=created_at&sortOrder=desc&limit=4"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch new arrival products");
        }
        const data = await response.json();
        setNewProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load new arrivals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-nike">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-nike-display text-5xl md:text-6xl mb-6">
            New Arrivals
          </h2>
          <p className="text-nike-body text-xl text-nike-gray-600 max-w-2xl mx-auto">
            Fresh drops just in! Discover the latest additions to our
            collection.
          </p>
        </motion.div>

        <div className="responsive-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : newProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No new arrivals at the moment</p>
            </div>
          ) : (
            newProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            className="btn-nike-primary text-lg px-8 py-4"
            asChild
          >
            <Link href="/products?sortBy=created_at&sortOrder=desc">
              View All New Arrivals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NewArrivals;
