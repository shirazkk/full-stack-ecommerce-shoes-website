"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Menu, X, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { getUser, signOut } from "@/lib/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for storage events to refresh user data when avatar changes
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from account settings
    window.addEventListener("userUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleStorageChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "New & Featured" },
    { href: "/products?category=mens-shoes", label: "Men" },
    { href: "/products?category=womens-shoes", label: "Women" },
    { href: "/products?category=kids-shoes", label: "Kids" },
    { href: "/products?category=running-shoes", label: "Running" },
    { href: "/products?category=basketball-shoes", label: "Basketball" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-nike-gray-200">
      <div className="container-nike">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-nike-black rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-nike-display text-2xl font-bold text-nike-black">
                NIKE
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="text-nike-body font-medium text-nike-gray-700 hover:text-nike-black transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nike-orange-500 transition-all duration-200 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <motion.div
              className={`relative w-full transition-all duration-300 ${
                searchFocused ? "scale-105" : "scale-100"
              }`}
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nike-gray-400" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="input-nike pl-12 text-nike-black placeholder-nike-gray-400"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Button (Mobile) */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden w-12 h-12"
              >
                <Search className="h-5 w-5 text-nike-gray-600" />
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative w-12 h-12"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 text-nike-gray-600 hover:text-nike-orange-500 transition-colors" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-nike-orange-500 text-white text-xs font-bold flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative w-12 h-12"
                asChild
              >
                <Link href="/wishlist">
                  <Heart className="h-5 w-5 text-nike-gray-600 hover:text-nike-orange-500 transition-colors" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-nike-orange-500 text-white text-xs font-bold flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* User Account */}
            {loading ? (
              <div className="hidden md:flex w-12 h-12 items-center justify-center">
                <div className="w-6 h-6 border-2 border-nike-gray-300 border-t-nike-orange-500 rounded-full animate-spin" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex w-12 h-12 p-0"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={user.avatar_url}
                          alt={user.full_name || user.email}
                        />
                        <AvatarFallback className="bg-nike-orange-500 text-white text-sm font-semibold">
                          {user.full_name
                            ? user.full_name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex w-12 h-12"
                  asChild
                >
                  <Link href="/login">
                    <User className="h-5 w-5 text-nike-gray-600 hover:text-nike-orange-500 transition-colors" />
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-12 h-12"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 text-nike-gray-600" />
                  ) : (
                    <Menu className="h-5 w-5 text-nike-gray-600" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-nike-gray-200 bg-white"
          >
            <div className="container-nike py-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nike-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    className="input-nike pl-12"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="block text-nike-body font-medium text-nike-gray-700 hover:text-nike-black py-3 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-nike-gray-200"
                >
                  <Link
                    href="/account"
                    className="flex items-center gap-3 text-nike-body font-medium text-nike-gray-700 hover:text-nike-black py-3 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Account
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
