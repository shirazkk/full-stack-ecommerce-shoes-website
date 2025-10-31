"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import Image from "next/image";

const categories = [
  {
    name: "Men's Shoes",
    href: "/products?category=mens-shoes",
    image:
      "https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/mens-shoes/flying-colorful-womens-sneaker-isolated-on-white-background-fashionable-stylish-sports-shoe.jpg",
    description: "Premium footwear for men",
  },
  {
    name: "Women's Shoes",
    href: "/products?category=womens-shoes",
    image:
      "https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/womens-shoes/pexels-photo-134064.jpeg",
    description: "Elegant and comfortable shoes for women",
  },
  {
    name: "Kids' Shoes",
    href: "/products?category=kids-shoes",
    image:
      "https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/kids-shoes/pexels-photo-1598505.jpeg",
    description: "Fun and comfortable shoes for kids",
  },
];

export const CategoriesProduct = () => {
  return (
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
            Find the perfect footwear for every occasion and every member of
            your family
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
                      <h3 className="text-white text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-nike-gray-200 text-sm">
                        {category.description}
                      </p>
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
  );
};
