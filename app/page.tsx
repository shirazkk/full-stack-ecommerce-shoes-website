'use client';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, RefreshCw, CreditCard, Star, Zap, Award, Heart } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Product } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
    color: 'bg-nike-blue-500',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions',
    color: 'bg-nike-orange-500',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
    color: 'bg-green-500',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payment',
    description: 'Multiple payment options',
    color: 'bg-purple-500',
  },
];

const categories = [
  {
    name: "Men's Shoes",
    href: '/products?category=mens-shoes',
    image: 'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/mens-shoes/flying-colorful-womens-sneaker-isolated-on-white-background-fashionable-stylish-sports-shoe.jpg',
    description: 'Premium footwear for men',
  },
  {
    name: "Women's Shoes",
    href: '/products?category=womens-shoes',
    image: 'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/womens-shoes/pexels-photo-134064.jpeg',
    description: 'Elegant and comfortable shoes for women',
  },
  {
    name: "Kids' Shoes",
    href: '/products?category=kids-shoes',
    image: 'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/kids-shoes/pexels-photo-1598505.jpeg',
    description: 'Fun and comfortable shoes for kids',
  },
];

const stats = [
  { number: '50K+', label: 'Happy Customers' },
  { number: '10K+', label: 'Products Sold' },
  { number: '4.9', label: 'Average Rating' },
  { number: '24/7', label: 'Customer Support' },
];

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?isFeatured=true&limit=4');
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-nike-black via-nike-gray-900 to-nike-black text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            style={{ y: y1, opacity }}
            className="absolute top-20 left-10 w-32 h-32 bg-nike-orange-500/20 rounded-full blur-xl"
          />
          <motion.div
            style={{ y: y2, opacity }}
            className="absolute top-40 right-20 w-24 h-24 bg-nike-blue-500/20 rounded-full blur-xl"
          />
          <motion.div
            style={{ y: y1, opacity }}
            className="absolute bottom-20 left-1/4 w-40 h-40 bg-nike-orange-400/10 rounded-full blur-2xl"
          />
        </div>

        <div className="container-nike relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-2 text-nike-orange-400"
                >
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-sm font-medium">Premium Quality</span>
                </motion.div>
                
                <h1 className="text-nike-display text-6xl md:text-8xl lg:text-9xl leading-none">
                  Just Do
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-nike-orange-400 to-nike-orange-600">
                    It
                  </span>
                </h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-nike-body text-xl text-nike-gray-300 max-w-lg"
              >
                Discover the latest collection of premium footwear. Engineered for performance, designed for style, built for champions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="btn-nike-primary text-lg px-8 py-4" asChild>
                  <Link href="/products">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="btn-nike-secondary text-lg px-8 py-4" asChild>
                  <Link href="/products?featured=true">Featured</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-2 gap-8 pt-8"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-3xl font-bold text-nike-orange-400">{stat.number}</div>
                    <div className="text-sm text-nike-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative h-[600px] lg:h-[800px] flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1200&fit=crop"
                    alt="Featured Nike Shoe"
                    width={600}
                    height={600}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-nike-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                >
                  New Arrival
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-10 left-10 bg-nike-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                >
                  Limited Edition
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-nike-gray-50">
        <div className="container-nike">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center space-y-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-nike-display text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-nike-caption">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-nike">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-nike-display text-5xl md:text-6xl mb-6">
              Shop by Category
            </h2>
            <p className="text-nike-body text-xl text-nike-gray-600 max-w-2xl mx-auto">
              Find the perfect footwear for every occasion and every member of your family
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={category.href} className="block">
                  <div className="card-nike overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-nike-black/80 via-nike-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-nike-gray-200 text-sm">{category.description}</p>
                        <motion.div
                          whileHover={{ x: 10 }}
                          className="inline-flex items-center text-nike-orange-400 font-semibold mt-4"
                        >
                          Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-nike-gray-50">
        <div className="container-nike">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-nike-display text-5xl md:text-6xl mb-6">
              Featured Products
            </h2>
            <p className="text-nike-body text-xl text-nike-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our most popular and trending footwear
            </p>
          </motion.div>

          <div className="responsive-grid">
            {loading ? (
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
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No featured products available</p>
              </div>
            ) : (
              featuredProducts.map((product, index) => (
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
            <Button size="lg" className="btn-nike-primary text-lg px-8 py-4" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding gradient-nike">
        <div className="container-nike text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-nike-display text-5xl md:text-6xl text-white">
                Stay in the Game
              </h2>
              <p className="text-nike-body text-xl text-nike-gray-200 max-w-2xl mx-auto">
                Get exclusive access to new releases, special offers, and insider updates. Join the community of champions.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input-nike flex-1 text-nike-black"
              />
              <Button size="lg" className="btn-nike-primary text-lg px-8 py-4">
                Subscribe
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center items-center gap-8 text-nike-gray-300"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-nike-orange-400" />
                <span className="text-sm">Exclusive Drops</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-nike-orange-400" />
                <span className="text-sm">Member Benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-nike-orange-400" />
                <span className="text-sm">Early Access</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
