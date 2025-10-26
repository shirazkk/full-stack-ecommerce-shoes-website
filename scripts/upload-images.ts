// import { createClient } from '@supabase/supabase-js';
// import { readFileSync, readdirSync } from 'fs';
// import { join } from 'path';


// const supabaseServiceRoleKey = process.env.SERVICE_KEY;
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// if (!supabaseServiceRoleKey || !supabaseUrl) {
//   console.error('❌ Missing required environment variables: SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL');
//   process.exit(1);
// }

// const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// // Category mapping for organizing images
// const categories = [
//   'mens-shoes',
//   'womens-shoes', 
//   'kids-shoes',
//   'running-shoes',
//   'basketball-shoes',
//   'casual-sneakers'
// ];

// interface ImageMapping {
//   originalPath: string;
//   storagePath: string;
//   publicUrl: string;
//   category: string;
// }

// async function uploadImageToStorage(
//   filePath: string,
//   fileName: string,
//   category: string
// ): Promise<ImageMapping> {
//   try {
//     // Read the file
//     const fileBuffer = readFileSync(filePath);
    
//     // Generate storage path
//     const storagePath = `products/${category}/${fileName}`;
    
//     // Upload to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from('product-images')
//       .upload(storagePath, fileBuffer, {
//         contentType: 'image/jpeg',
//         cacheControl: 'public, max-age=31536000', // 1 year cache
//         upsert: false
//       });

//     if (error) {
//       throw new Error(`Failed to upload ${fileName}: ${error.message}`);
//     }

//     // Get public URL
//     const { data: publicUrlData } = supabase.storage
//       .from('product-images')
//       .getPublicUrl(data.path);

//     return {
//       originalPath: filePath,
//       storagePath: data.path,
//       publicUrl: publicUrlData.publicUrl,
//       category
//     };
//   } catch (error) {
//     console.error(`❌ Error uploading ${fileName}:`, error);
//     throw error;
//   }
// }

// async function uploadAllImages() {
//   try {
//     console.log('🚀 Starting image upload to Supabase Storage...');
    
//     const imagesDir = join(process.cwd(), 'public', 'shoes-images');
//     const imageFiles = readdirSync(imagesDir).filter(file => 
//       file.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)
//     );

//     console.log(`📁 Found ${imageFiles.length} images to upload`);
    
//     const imageMappings: ImageMapping[] = [];
//     const imagesPerCategory = Math.ceil(imageFiles.length / categories.length);
    
//     // Distribute images across categories
//     for (let i = 0; i < imageFiles.length; i++) {
//       const fileName = imageFiles[i];
//       const filePath = join(imagesDir, fileName);
//       const categoryIndex = Math.floor(i / imagesPerCategory);
//       const category = categories[Math.min(categoryIndex, categories.length - 1)];
      
//       console.log(`📤 Uploading ${fileName} to category: ${category}`);
      
//       try {
//         const mapping = await uploadImageToStorage(filePath, fileName, category);
//         imageMappings.push(mapping);
//         console.log(`✅ Uploaded: ${fileName} -> ${mapping.publicUrl}`);
//       } catch (error) {
//         console.error(`❌ Failed to upload ${fileName}:`, error);
//         // Continue with other images
//       }
//     }

//     // Generate mapping file for seed data
//     console.log('\n📋 Generating image mappings...');
    
//     const categoryMappings: { [key: string]: string[] } = {};
//     categories.forEach(cat => categoryMappings[cat] = []);
    
//     imageMappings.forEach(mapping => {
//       categoryMappings[mapping.category].push(mapping.publicUrl);
//     });

//     // Log summary
//     console.log('\n🎉 Upload completed!');
//     console.log(`✅ Successfully uploaded ${imageMappings.length} images`);
//     console.log('\n📊 Images per category:');
//     categories.forEach(category => {
//       const count = categoryMappings[category].length;
//       console.log(`  ${category}: ${count} images`);
//     });

//     // Save mappings to file for reference
//     const mappingsFile = join(process.cwd(), 'scripts', 'image-mappings.json');
//     require('fs').writeFileSync(mappingsFile, JSON.stringify({
//       categories: categoryMappings,
//       allImages: imageMappings
//     }, null, 2));

//     console.log(`\n💾 Image mappings saved to: ${mappingsFile}`);
//     console.log('\n📝 Next steps:');
//     console.log('1. Update lib/seed/products.ts with the new image URLs');
//     console.log('2. Re-run the database seed script');
//     console.log('3. Update next.config.ts to allow Supabase domains');

//   } catch (error) {
//     console.error('❌ Error during upload process:', error);
//     process.exit(1);
//   }
// }

// // Run the upload
// uploadAllImages();
