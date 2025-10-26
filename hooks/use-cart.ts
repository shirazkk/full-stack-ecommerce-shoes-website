'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Cart, CartItem, Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart | null;
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setCartItems(data.cart?.items || []);
      } else if (response.status === 401) {
        // User not authenticated, clear cart
        setCartItems([]);
        setCart(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1, size: string = 'M', color: string = 'Black') => {
    try {
      setLoading(true);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          size,
          color,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        setCartItems(data.cart?.items || []);
        
        toast({
          title: 'Added to Cart',
          description: `${product.name} has been added to your cart.`,
        });
      } else if (response.status === 401) {
        toast({
          title: 'Login Required',
          description: 'Please log in to add items to your cart.',
          variant: 'destructive',
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add to cart (${response.status})`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);

      // If authenticated, call API
      if (cart) {
        const response = await fetch(`/api/cart/${cart.id}/items/${itemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCart(); // Refresh cart
        } else {
          throw new Error('Failed to remove from cart');
        }
      } else {
        toast({
          title: 'Login Required',
          description: 'Please log in to manage your cart.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);

      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      // If authenticated, call API
      if (cart) {
        const response = await fetch(`/api/cart/${cart.id}/items/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        });

        if (response.ok) {
          await fetchCart(); // Refresh cart
        } else {
          throw new Error('Failed to update quantity');
        }
      } else {
        toast({
          title: 'Login Required',
          description: 'Please log in to manage your cart.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      if (cart) {
        const response = await fetch(`/api/cart/${cart.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setCart(null);
          setCartItems([]);
        } else {
          throw new Error('Failed to clear cart');
        }
      } else {
        toast({
          title: 'Login Required',
          description: 'Please log in to manage your cart.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value: CartContextType = {
    cart,
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
  };

  return React.createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
