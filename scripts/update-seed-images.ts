// import fs from 'fs';
// import path from 'path';

// // Read the image mappings
// const imageMappings = JSON.parse(fs.readFileSync('scripts/image-mappings.json', 'utf8'));

// // Read the current seed data
// const seedDataPath = 'lib/seed/products.ts';
// let seedContent = fs.readFileSync(seedDataPath, 'utf8');

// // Function to get random images from a category
// function getRandomImages(category: string, count: number): string[] {
//   const categoryImages = imageMappings.categories[category] || [];
//   const shuffled = [...categoryImages].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

// // Update category images (they should already be correct, but let's verify)
// const categoryUpdates = [
//   {
//     search: 'image_url: \'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/mens-shoes/flying-colorful-womens-sneaker-isolated-on-white-background-fashionable-stylish-sports-shoe.jpg\'',
//     replace: `image_url: '${imageMappings.categories['mens-shoes'][0]}'`
//   },
//   {
//     search: 'image_url: \'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/womens-shoes/pexels-photo-134064.jpeg\'',
//     replace: `image_url: '${imageMappings.categories['womens-shoes'][0]}'`
//   },
//   {
//     search: 'image_url: \'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/kids-shoes/pexels-photo-1598505.jpeg\'',
//     replace: `image_url: '${imageMappings.categories['kids-shoes'][0]}'`
//   },
//   {
//     search: 'image_url: \'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/running-shoes/pexels-photo-267320.jpeg\'',
//     replace: `image_url: '${imageMappings.categories['running-shoes'][0]}'`
//   },
//   {
//     search: 'image_url: \'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/basketball-shoes/photo-1525966222134-fcfa99b8ae77.jpg\'',
//     replace: `image_url: '${imageMappings.categories['basketball-shoes'][0]}'`
//   },
//   {
//     search: 'image_url: \'https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/casual-sneakers/photo-1595341888016-a392ef81b7de.jpg\'',
//     replace: `image_url: '${imageMappings.categories['casual-sneakers'][0]}'`
//   }
// ];

// // Apply category updates
// categoryUpdates.forEach(update => {
//   if (seedContent.includes(update.search)) {
//     seedContent = seedContent.replace(update.search, update.replace);
//     console.log(`✅ Updated category image`);
//   }
// });

// // Now let's update product images systematically
// // We'll replace all the incorrect product image URLs with correct ones from the mappings

// // Get all the product image arrays and replace them
// const productImagePattern = /images:\s*\[[\s\S]*?\]/g;
// const matches = seedContent.match(productImagePattern);

// if (matches) {
//   console.log(`Found ${matches.length} product image arrays to update`);
  
//   // For each product, we need to determine its category and assign appropriate images
//   // Let's create a mapping of products to their categories and update accordingly
  
//   // Men's shoes products
//   const mensShoesImages = getRandomImages('mens-shoes', 3);
//   seedContent = seedContent.replace(
//     /name: 'Nike Air Max 270'[\s\S]*?images:\s*\[[\s\S]*?\]/,
//     `name: 'Nike Air Max 270',
//     slug: 'nike-air-max-270',
//     description: 'Experience ultimate comfort with the Nike Air Max 270.',
//     price: 150.00,
//     sale_price: 120.00,
//     brand: 'Nike',
//     colors: ['Black', 'White', 'Red'],
//     sizes: ['7', '8', '9', '10', '11', '12'],
//     images: ${JSON.stringify(mensShoesImages)}`
//   );
  
//   // Continue with other products...
//   // This is getting complex, let me create a more systematic approach
// }

// // Write the updated content back
// fs.writeFileSync(seedDataPath, seedContent);
// console.log('✅ Updated seed data with correct image URLs');
