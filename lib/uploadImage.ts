"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadProductImagesClient(
  files: FileList,
  productSlug: string
): Promise<string[]> {
  const supabase = createClient();
  const uploadedUrls: string[] = [];

  for (const [index, file] of Array.from(files).entries()) {
    // validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) throw new Error("Invalid file type.");

    // validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) throw new Error("File too large (max 5MB).");

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const path = `products/${productSlug}/${index}-${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}
