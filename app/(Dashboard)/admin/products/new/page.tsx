"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AddProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    sale_price: "",
    brand: "",
    stock: "",
    category_id: "",
    colors: "",
    sizes: "",
    images: "",
    is_new: false,
    is_featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 📸 Upload multiple images to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      const productId = formData.slug || `temp-${Date.now()}`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("productId", productId);
        formDataToSend.append("imageIndex", i.toString());

        const res = await fetch("/api/admin/imageupload", {
          method: "POST",
          body: formDataToSend,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.publicUrl);
      }

      setFormData((prev) => ({
        ...prev,
        images: uploadedUrls.join(", "),
      }));

      toast({
        title: "✅ Images uploaded successfully!",
        description: `${uploadedUrls.length} image(s) added.`,
      });
    } catch (err: any) {
      toast({
        title: "❌ Upload failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          sale_price: formData.sale_price
            ? parseFloat(formData.sale_price)
            : null,
          stock: parseInt(formData.stock),
          colors: formData.colors.split(",").map((c) => c.trim()),
          sizes: formData.sizes.split(",").map((s) => s.trim()),
          images: formData.images.split(",").map((i) => i.trim()),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      toast({
        title: "✅ Product Created Successfully",
        description: `${formData.name} has been added.`,
      });

      router.push("/admin/products");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "❌ Error",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

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
            placeholder="unique-product-slug"
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

        {/* Price and Sale Price */}
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
              value={formData.sale_price}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Brand and Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Brand</Label>
            <Input
              name="brand"
              value={formData.brand}
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

        {/* Category ID */}
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
              placeholder="Red, Blue, Black"
              value={formData.colors}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Sizes (comma separated)</Label>
            <Input
              name="sizes"
              placeholder="S, M, L, XL"
              value={formData.sizes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Toggles */}
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

        {/* 🖼️ Updated Images Section */}
        <div>
          <Label>Product Images</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}

          {formData.images && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.images.split(",").map((url, i) => (
                <img
                  key={i}
                  src={url.trim()}
                  alt={`preview-${i}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* ✅ Submit */}
        <Button
          type="submit"
          disabled={loading || uploading}
          className="w-full text-lg py-6"
        >
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
}
