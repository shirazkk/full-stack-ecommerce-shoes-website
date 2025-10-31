"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Zap,
  ChevronDown,
} from "lucide-react";
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
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
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

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
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
    { href: "/products", label: "Shop" },
    { href: "/products?category=mens-shoes", label: "Men" },
    { href: "/products?category=womens-shoes", label: "Women" },
    { href: "/products?category=kids-shoes", label: "Kids" },
    { href: "/products?category=running-shoes", label: "Running" },
    { href: "/products?category=basketball-shoes", label: "Basketball" },
  ];

  const dropdownAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="container-nike">
        <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="hidden xs:block text-xl sm:text-2xl font-bold text-nike-black tracking-tight">
                NIKE
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <motion.div
                key={link.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="px-2 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group rounded-lg hover:bg-gray-50"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-4">
            <motion.div
              className="relative w-full"
              animate={{ scale: searchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search
                className={`absolute left-3 lg:left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                  searchFocused ? "text-orange-500" : "text-gray-400"
                }`}
              />
              <Input
                type="search"
                placeholder="Search"
                className={`w-full pl-9 lg:pl-12 pr-4 py-2 text-sm bg-gray-50 border rounded-full outline-none transition-all ${
                  searchFocused
                    ? "border-orange-500 bg-white shadow-md ring-2 ring-orange-100"
                    : "border-transparent hover:bg-gray-100"
                }`}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-100 rounded-full"
                asChild
              >
                <Link href="/wishlist">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-orange-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="relative w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-100 rounded-full"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-orange-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </Button>
            </motion.div>

            {/* User Account */}
            {loading ? (
              <div className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
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
                      className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 p-0 hover:bg-gray-100 rounded-full"
                    >
                      <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-transparent hover:ring-orange-500 transition-all">
                        <AvatarImage
                          src={user.avatar_url || "/placeholder.svg"}
                          alt={user.full_name || user.email}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-semibold">
                          {user.full_name
                            ? user.full_name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2" asChild>
                  <motion.div
                    initial={dropdownAnimation.initial}
                    animate={dropdownAnimation.animate}
                    exit={dropdownAnimation.exit}
                    transition={dropdownAnimation.transition}
                  >
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-t-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={user.avatar_url || "/placeholder.svg"}
                            alt={user.full_name || user.email}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                            {user.full_name
                              ? user.full_name.charAt(0).toUpperCase()
                              : user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5 leading-none overflow-hidden">
                          <p className="font-semibold text-sm truncate">
                            {user.full_name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/account" className="flex items-center">
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/account/orders" className="flex items-center">
                          Order History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </div>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-100 rounded-full"
                    >
                      <User className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2" asChild>
                  <motion.div
                    initial={dropdownAnimation.initial}
                    animate={dropdownAnimation.animate}
                    exit={dropdownAnimation.exit}
                    transition={dropdownAnimation.transition}
                  >
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="flex flex-col space-y-0.5 p-3 bg-gray-50 rounded-t-lg">
                        <p className="font-semibold text-sm">Welcome</p>
                        <p className="text-xs text-muted-foreground">
                          Sign in to access your account
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/login" className="flex items-center">
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/signup" className="flex items-center">
                          Create Account
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-100 rounded-full"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileMenuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileMenuOpen ? (
                      <X className="h-5 w-5 text-gray-600" />
                    ) : (
                      <Menu className="h-5 w-5 text-gray-600" />
                    )}
                  </motion.div>
                </AnimatePresence>
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
            className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg shadow-lg"
          >
            <div className="container-nike py-4 sm:py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Mobile Search */}
              <div className="mb-4 sm:mb-6 block md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search for products..."
                    className="w-full pl-9 sm:pl-12 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors active:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile User Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                  className="pt-4 mt-4 border-t block md:hidden border-gray-200"
                >
                  {loading ? (
                    <div className="flex w-full py-3 items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                    </div>
                  ) : user ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="w-10 h-10 ring-2 ring-orange-500 flex-shrink-0">
                            <AvatarImage
                              src={user.avatar_url || "/placeholder.svg"}
                              alt={user.full_name || user.email}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold">
                              {user.full_name
                                ? user.full_name.charAt(0).toUpperCase()
                                : user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col overflow-hidden text-left">
                            <span className="font-semibold text-sm truncate">
                              {user.full_name || "User"}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-600 flex-shrink-0 transition-transform ${
                            mobileAccountOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileAccountOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pt-2">
                              <Link
                                href="/account"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileAccountOpen(false);
                                }}
                              >
                                Account Settings
                              </Link>
                              <Link
                                href="/account/orders"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileAccountOpen(false);
                                }}
                              >
                                Order History
                              </Link>
                              <Button
                                variant="ghost"
                                className="w-full justify-start px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                onClick={() => {
                                  handleSignOut();
                                  setMobileMenuOpen(false);
                                  setMobileAccountOpen(false);
                                }}
                              >
                                Sign Out
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Sign In / Sign Up
                    </Link>
                  )}
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
