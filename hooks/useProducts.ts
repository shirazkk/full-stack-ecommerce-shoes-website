// import type { ProductFilters } from "@/lib/services/product.service";
// import { Product } from "@/types";
// import { useState, useEffect } from "react";

// interface UseProductsResult {
//   products: Product[];
//   loading: boolean;
//   error: string | null;
//   total: number;
//   refetch: () => void;
// }

// export function useProducts(filters: ProductFilters): UseProductsResult {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [total, setTotal] = useState(0);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const params = new URLSearchParams();
//       if (filters.limit) params.set("limit", String(filters.limit));
//       if (filters.offset !== undefined) params.set("offset", String(filters.offset));
//       if (filters.search) params.set("search", filters.search);
//       if (filters.category && filters.category !== "all") params.set("category", filters.category);
//       if (filters.status && filters.status !== "all") params.set("status", filters.status);
//       if (filters.sortBy) params.set("sortBy", filters.sortBy);
//       if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

//       const url = `/api/products?${params.toString()}`;
//       const response = await fetch(url);

//       if (!response.ok) throw new Error("Failed to fetch products");

//       const data = await response.json();

//       setProducts(data.products || []);
//       setTotal(data.total ?? 0);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//       setProducts([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [
//     filters.limit,
//     filters.offset,
//     filters.search,
//     filters.category,
//     filters.status,
//     filters.sortBy,
//     filters.sortOrder,
//   ]);

//   return {
//     products,
//     loading,
//     error,
//     total,
//     refetch: fetchProducts,
//   };
// }
