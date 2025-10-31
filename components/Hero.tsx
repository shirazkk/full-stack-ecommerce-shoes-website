"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "10K+", label: "Products Sold" },
  { number: "4.9", label: "Average Rating" },
  { number: "24/7", label: "Customer Support" },
];

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  return (
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
              Discover the latest collection of premium footwear. Engineered for
              performance, designed for style, built for champions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="btn-nike-primary text-lg px-8 py-4"
                asChild
              >
                <Link href="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-nike-secondary text-lg px-8 py-4"
                asChild
              >
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
                  <div className="text-3xl font-bold text-nike-orange-400">
                    {stat.number}
                  </div>
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
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <Image
                  src="https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/basketball-shoes/photo-1539185441755-769473a23570.jpg"
                  alt="Hero Shoe"
                  priority
                  width={600}
                  height={600}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 bg-nike-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
              >
                New Arrival
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-10 left-10 bg-nike-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
              >
                Limited Edition
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
