// import { createClient } from '@supabase/supabase-js';
// import { seedCategories, seedProducts } from '../lib/seed/products';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// if (!supabaseKey || !supabaseUrl) {
//   console.error('❌ Missing required environment variables: SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL');
//   process.exit(1);
// }


// const supabase = createClient(supabaseUrl, supabaseKey);

// async function seedDatabase() {
//   try {
//     console.log('🌱 Starting database seeding...');

//     // 1. Seed Categories
//     console.log('📁 Seeding categories...');
//     const { data: categories, error: categoriesError } = await supabase
//       .from('categories')
//       .insert(seedCategories)
//       .select();

//     if (categoriesError) {
//       console.error('Error seeding categories:', categoriesError);
//       return;
//     }

//     console.log(`✅ Created ${categories.length} categories`);

//     // 2. Update products with category IDs
//     const updatedProducts = seedProducts.map((product, index) => {
//       // Assign categories based on product type
//       let categoryId = '';
//       if (product.brand === 'Nike' && product.name.includes('Air Max')) {
//         categoryId = categories.find(c => c.slug === 'mens-shoes')?.id || '';
//       } else if (product.brand === 'Adidas' && product.name.includes('Ultraboost')) {
//         categoryId = categories.find(c => c.slug === 'womens-shoes')?.id || '';
//       } else if (product.name.includes('Running') || product.brand === 'Asics' || product.brand === 'Brooks' || product.brand === 'Hoka') {
//         categoryId = categories.find(c => c.slug === 'running-shoes')?.id || '';
//       } else if (product.name.includes('Basketball') || product.brand === 'Jordan') {
//         categoryId = categories.find(c => c.slug === 'basketball-shoes')?.id || '';
//       } else {
//         categoryId = categories.find(c => c.slug === 'casual-sneakers')?.id || '';
//       }

//       return {
//         ...product,
//         category_id: categoryId,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       };
//     });

//     // 3. Seed Products
//     console.log('👟 Seeding products...');
//     const { data: products, error: productsError } = await supabase
//       .from('products')
//       .insert(updatedProducts)
//       .select();

//     if (productsError) {
//       console.error('Error seeding products:', productsError);
//       return;
//     }

//     console.log(`✅ Created ${products.length} products`);

//     // 4. Create admin user
//     console.log('👤 Creating admin user...');
//     const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
//       email: 'admin@nike.com',
//       password: 'admin123',
//       email_confirm: true,
//       user_metadata: {
//         full_name: 'Admin User',
//       },
//     });

//     if (adminError) {
//       console.error('Error creating admin user:', adminError);
//     } else {
//       // Create admin profile
//       const { error: profileError } = await supabase
//         .from('profiles')
//         .insert({
//           id: adminUser.user.id,
//           email: adminUser.user.email,
//           full_name: 'Admin User',
//           role: 'admin',
//         });

//       if (profileError) {
//         console.error('Error creating admin profile:', profileError);
//       } else {
//         console.log('✅ Created admin user: admin@nike.com / admin123');
//       }
//     }

//     console.log('🎉 Database seeding completed successfully!');
//     console.log('\n📊 Summary:');
//     console.log(`- Categories: ${categories.length}`);
//     console.log(`- Products: ${products.length}`);
//     console.log('- Admin user: admin@nike.com / admin123');

//   } catch (error) {
//     console.error('❌ Error during seeding:', error);
//     process.exit(1);
//   }
// }

// seedDatabase();