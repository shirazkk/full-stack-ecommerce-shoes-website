"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";

export default function AdminProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) fetchProduct();
  }, [params.slug]);

  // ✅ Delete Product Handler
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${params.slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete product");
      }

      toast({
        title: "🗑️ Product Deleted",
        description: `${product?.name} has been removed successfully.`,
      });

      router.push("/admin/products");
    } catch (error: any) {
      console.error("Delete Error:", error);
      toast({
        title: "❌ Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
        <Link href="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-sm">{product.category?.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <Button variant="secondary">
            <Link href={`/admin/products/${product.slug}/edit`}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {deleting ? "Deleting..." : "Remove"}
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-4 rounded-xl shadow-sm"
        >
          <div className="aspect-square relative overflow-hidden rounded-xl">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.is_new && (
              <Badge className="absolute top-3 left-3 bg-green-500 text-white">
                New
              </Badge>
            )}
            {product.sale_price && (
              <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                Sale
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images?.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square relative rounded-lg overflow-hidden border"
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4 bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-gray-800">
              ${product.sale_price || product.price}
            </p>
            {product.sale_price && (
              <span className="text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>

          <div className="text-gray-600 text-sm space-y-2">
            <p>
              <strong>ID:</strong> {product.id}
            </p>
            <p>
              <strong>Slug:</strong> {product.slug}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Category ID:</strong> {product.category_id}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Colors</h3>
            <div className="flex gap-2 flex-wrap">
              {product.colors?.map((c) => (
                <Badge key={c} className="bg-gray-100 text-gray-800 border">
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sizes</h3>
            <div className="flex gap-2 flex-wrap">
              {product.sizes?.map((s) => (
                <Badge key={s} className="bg-gray-100 text-gray-800 border">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>Created at: {new Date(product.created_at).toLocaleString()}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
