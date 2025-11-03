"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Search as SearchIcon } from "lucide-react";
import debounce from "lodash/debounce";
import { Product } from "@/types";
import Image from "next/image";

export default function SearchProducts() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        if (data.products.length === 0) {
          setSearchResults([]);
          setNoResults(true);
        } else {
          setSearchResults(data.products);
          setNoResults(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setNoResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleSearchClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setSearchResults([]);
    setNoResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
        setNoResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 w-full"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Search Results Dropdown */}
      {(searchResults.length > 0 || noResults || isSearching) && (
        <div className="absolute top-full left-0 right-0 bg-white mt-1 shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-center text-gray-600">Searching...</div>
          )}

          {!isSearching && noResults && (
            <div className="p-4 text-center text-gray-500">
              No results found 😔
            </div>
          )}

          {!isSearching &&
            searchResults.length > 0 &&
            searchResults.map((product) => (
              <div
                key={product.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => handleSearchClick(product.slug)}
              >
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
