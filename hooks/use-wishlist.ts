'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  loading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const wishlistCount = wishlist.length;

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist');
      
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      } else if (response.status === 401) {
        // User not authenticated, clear wishlist
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (response.ok) {
        await fetchWishlist(); // Refresh wishlist
        
        toast({
          title: 'Added to Wishlist',
          description: `${product.name} has been added to your wishlist.`,
        });
      } else if (response.status === 401) {
        toast({
          title: 'Login Required',
          description: 'Please log in to add items to your wishlist.',
          variant: 'destructive',
        });
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error === 'Item already in wishlist') {
          toast({
            title: 'Already in Wishlist',
            description: `${product.name} is already in your wishlist.`,
            variant: 'destructive',
          });
        } else {
          throw new Error(errorData.error || 'Failed to add to wishlist');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add to wishlist (${response.status})`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setLoading(true);
      
      // If authenticated, call API
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchWishlist(); // Refresh wishlist
      } else if (response.status === 401) {
        toast({
          title: 'Login Required',
          description: 'Please log in to manage your wishlist.',
          variant: 'destructive',
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to remove from wishlist (${response.status})`);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.product_id === productId);
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const value: WishlistContextType = {
    wishlist,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
  };

  return React.createElement(WishlistContext.Provider, { value }, children);
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
