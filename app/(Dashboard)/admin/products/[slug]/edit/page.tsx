"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams(); // slug from URL

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // 🔹 1️⃣ Fetch existing product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        setFormData(data.product);
      } catch (error) {
        console.error("Fetch product failed:", error);
        toast({
          title: "Error",
          description: "Failed to load product data.",
          variant: "destructive",
        });
      }
    };
    fetchProduct();
  }, [params.slug, toast]);

  // 🔹 2️⃣ Handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 🔹 3️⃣ Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("productId", formData.slug); // use slug as folder
        formDataUpload.append("imageIndex", i.toString());

        const res = await fetch("/api/admin/imageupload", {
          method: "PUT",
          body: formDataUpload,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Image upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.publicUrl);
      }

      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls],
      }));

      toast({
        title: "✅ Images uploaded",
        description: `${uploadedUrls.length} image(s) added.`,
      });
    } catch (err: any) {
      toast({
        title: "Upload Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Handle image deletion
  const handleImageDelete = async (url: string) => {
    try {
      const parts = url.split("/product-images/");
      const path = parts[1]; // ✅ "products/abc123/shoe.png"
      const bucket = "product-images"; // ✅ your bucket name

      if (!path) throw new Error("Invalid image path");

      // ✅ Call the DELETE API with bucket + path
      const res = await fetch(
        `/api/admin/imageupload?bucket=${bucket}&path=${encodeURIComponent(
          path
        )}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete image");
      }

      // ✅ Remove from local state
      setFormData((prev: any) => ({
        ...prev,
        images: prev.images.filter((img: string) => img !== url),
      }));

      toast({
        title: "🗑️ Image Deleted",
        description: "The image was removed successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Delete Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // 🔹 4️⃣ Handle form submit (PUT request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🧠 Prepare clean object (remove fields Supabase doesn’t expect)
      const {
        name,
        slug,
        description,
        price,
        sale_price,
        stock,
        brand,
        category_id,
        colors,
        sizes,
        images,
        is_new,
        is_featured,
      } = formData;

      const cleanData = {
        name,
        slug,
        description,
        price: parseFloat(price),
        sale_price: sale_price ? parseFloat(sale_price) : null,
        stock: parseInt(stock),
        brand,
        category_id,
        colors: Array.isArray(colors)
          ? colors
          : colors.split(",").map((c: string) => c.trim()),
        sizes: Array.isArray(sizes)
          ? sizes
          : sizes.split(",").map((s: string) => s.trim()),
        images: Array.isArray(images)
          ? images
          : images.split(",").map((i: string) => i.trim()),
        is_new: !!is_new,
        is_featured: !!is_featured,
      };

      const res = await fetch(`/api/products/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      toast({
        title: "✅ Product Updated Successfully",
        description: `${formData.name} has been updated.`,
      });

      router.push("/admin/products");
    } catch (err: any) {
      toast({
        title: "❌ Update Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <p className="p-6 text-center">Loading product...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <Label>Slug</Label>
          <Input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price & Sale Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Sale Price</Label>
            <Input
              name="sale_price"
              type="number"
              value={formData.sale_price || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Brand & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Brand</Label>
            <Input
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Stock</Label>
            <Input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <Label>Category ID</Label>
          <Input
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          />
        </div>

        {/* Colors & Sizes */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Colors (comma separated)</Label>
            <Input
              name="colors"
              value={
                Array.isArray(formData.colors)
                  ? formData.colors.join(", ")
                  : formData.colors || ""
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Sizes (comma separated)</Label>
            <Input
              name="sizes"
              value={
                Array.isArray(formData.sizes)
                  ? formData.sizes.join(", ")
                  : formData.sizes || ""
              }
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleChange}
            />
            <span>Is New</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            <span>Is Featured</span>
          </label>
        </div>

        {/* Product Images */}
        <div>
          <Label>Product Images</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}

          {formData.images && formData.images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {formData.images.map((url: string, i: number) => (
                <div
                  key={i}
                  className="relative w-20 h-20 group border rounded overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`product-${i}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || uploading}
          className="w-full text-lg py-6"
        >
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </form>
    </div>
  );
}
