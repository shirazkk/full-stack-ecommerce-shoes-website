export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  sale_price?: number;
  category_id?: string;
  category?: Category;
  brand?: string;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  created_at: string;
  updated_at: string;
  cart_items?: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  stripe_payment_intent_id?: string;
  shipping_address: Address;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product?: Product;
  quantity: number;
  size: string;
  color: string;
  price: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  profile?: Profile;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
  accessToken: string;
}


export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasMore: boolean;
}