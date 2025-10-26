// import fs from 'fs';

// // Read the current seed data
// const seedDataPath = 'lib/seed/products.ts';
// let seedContent = fs.readFileSync(seedDataPath, 'utf8');

// // Pattern to match URLs with extra path segments like /products/123456/category/filename
// const urlPattern = /https:\/\/pwyzxwidebovzxwdxoep\.supabase\.co\/storage\/v1\/object\/public\/product-images\/products\/\d+\/([^']+)/g;

// // Replace all URLs with the correct format
// seedContent = seedContent.replace(urlPattern, (match, restOfPath) => {
//   return `https://pwyzxwidebovzxwdxoep.supabase.co/storage/v1/object/public/product-images/products/${restOfPath}`;
// });

// // Write the updated content back
// fs.writeFileSync(seedDataPath, seedContent);
// console.log('✅ Fixed all image URLs by removing extra path segments');
