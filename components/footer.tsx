'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Zap, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function Footer() {
  const footerSections = [
    {
      title: 'Find Store',
      links: [
        { label: 'New & Featured', href: '/products?filter=new' },
        { label: 'Best Sellers', href: '/products?filter=bestsellers' },
        { label: 'Sale', href: '/products?filter=sale' },
        { label: 'All Products', href: '/products' },
      ],
    },
    {
      title: 'Men',
      links: [
        { label: "Men's Shoes", href: '/products?category=mens-shoes' },
        { label: "Running", href: '/products?category=running-shoes' },
        { label: "Basketball", href: '/products?category=basketball-shoes' },
        { label: 'Training', href: '/products?category=training-shoes' },
      ],
    },
    {
      title: 'Women',
      links: [
        { label: "Women's Shoes", href: '/products?category=womens-shoes' },
        { label: "Running", href: '/products?category=running-shoes' },
        { label: "Basketball", href: '/products?category=basketball-shoes' },
        { label: 'Training', href: '/products?category=training-shoes' },
      ],
    },
    {
      title: 'Kids',
      links: [
        { label: "Kids' Shoes", href: '/products?category=kids-shoes' },
        { label: "Running", href: '/products?category=running-shoes' },
        { label: "Basketball", href: '/products?category=basketball-shoes' },
        { label: 'Training', href: '/products?category=training-shoes' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faq' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
      ],
    },
  ];

  return (
    <footer className="bg-nike-black text-white">
      <div className="container-nike">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-nike-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-nike-display text-3xl md:text-4xl">
                Stay in the Game
              </h3>
              <p className="text-nike-body text-lg text-nike-gray-300 max-w-2xl mx-auto">
                Get exclusive access to new releases, special offers, and insider updates. Join the community of champions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="input-nike flex-1 text-nike-black"
                />
                <Button className="btn-nike-primary">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-nike-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-nike-display text-2xl font-bold">NIKE</span>
                </Link>
                <p className="text-nike-body text-nike-gray-300">
                  Just Do It. Discover the latest collection of premium footwear. Engineered for performance, designed for style, built for champions.
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Facebook, href: '#' },
                    { icon: Instagram, href: '#' },
                    { icon: Twitter, href: '#' },
                    { icon: Youtube, href: '#' },
                  ].map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={social.href}
                        className="w-10 h-10 bg-nike-gray-800 rounded-full flex items-center justify-center hover:bg-nike-orange-500 transition-colors"
                      >
                        <social.icon className="h-5 w-5" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-nike-display text-lg font-semibold mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="text-nike-body text-nike-gray-300 hover:text-nike-orange-400 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-nike-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-nike-body text-nike-gray-400">
              © {new Date().getFullYear()} Nike, Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="text-nike-gray-400 hover:text-nike-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-nike-gray-400 hover:text-nike-orange-400 transition-colors">
                Terms of Use
              </Link>
              <Link href="/cookies" className="text-nike-gray-400 hover:text-nike-orange-400 transition-colors">
                Cookie Settings
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}