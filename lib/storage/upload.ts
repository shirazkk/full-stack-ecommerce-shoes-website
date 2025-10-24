import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File | Buffer;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl: string;
}

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const supabase = await createClient();
  
  const { bucket, path, file, contentType, cacheControl, upsert = false } = options;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      cacheControl,
      upsert,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    fullPath: data.fullPath,
    publicUrl: publicUrlData.publicUrl,
  };
}

/**
 * Upload and optimize an image
 */
export async function uploadImage(
  file: File,
  bucket: string,
  path: string,
  resizeOptions?: ImageResizeOptions
): Promise<UploadResult> {
  // For now, we'll upload the original file
  // In production, you might want to use a service like Cloudinary or ImageKit
  // for automatic image optimization
  
  const contentType = file.type || 'image/jpeg';
  
  return uploadFile({
    bucket,
    path,
    file,
    contentType,
    cacheControl: 'public, max-age=31536000', // 1 year cache
  });
}

/**
 * Generate a unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Upload product images with validation
 */
export async function uploadProductImage(
  file: File,
  productId: string,
  imageIndex: number = 0
): Promise<UploadResult> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validateFileType(file, allowedTypes)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  // Validate file size (5MB max)
  if (!validateFileSize(file, 5)) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  // Generate unique filename
  const filename = generateUniqueFilename(file.name);
  const path = `products/${productId}/${imageIndex}/${filename}`;

  return uploadImage(file, 'product-images', path, {
    width: 800,
    height: 800,
    quality: 85,
    format: 'webp',
  });
}

/**
 * Upload category images
 */
export async function uploadCategoryImage(
  file: File,
  categoryId: string
): Promise<UploadResult> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validateFileType(file, allowedTypes)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  // Validate file size (2MB max)
  if (!validateFileSize(file, 2)) {
    throw new Error('File size too large. Maximum size is 2MB.');
  }

  // Generate unique filename
  const filename = generateUniqueFilename(file.name);
  const path = `categories/${categoryId}/${filename}`;

  return uploadImage(file, 'category-images', path, {
    width: 400,
    height: 400,
    quality: 85,
    format: 'webp',
  });
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * List files in a bucket
 */
export async function listFiles(bucket: string, path?: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data;
}
