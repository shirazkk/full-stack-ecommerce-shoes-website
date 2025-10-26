// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseServiceRoleKey || !supabaseUrl) {
//   console.error('❌ Missing required environment variables: SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL');
//   process.exit(1);
// }

// const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// async function clearDatabase() {
//   try {
//     console.log('🧹 Starting database cleanup...');
    
//     // Clear data in the correct order (respecting foreign key constraints)
//     console.log('🗑️  Clearing order_items...');
//     const { error: orderItemsError } = await supabase
//       .from('order_items')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
//     if (orderItemsError) {
//       console.error('❌ Error clearing order_items:', orderItemsError);
//     } else {
//       console.log('✅ Cleared order_items');
//     }

//     console.log('🗑️  Clearing orders...');
//     const { error: ordersError } = await supabase
//       .from('orders')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (ordersError) {
//       console.error('❌ Error clearing orders:', ordersError);
//     } else {
//       console.log('✅ Cleared orders');
//     }

//     console.log('🗑️  Clearing cart_items...');
//     const { error: cartItemsError } = await supabase
//       .from('cart_items')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (cartItemsError) {
//       console.error('❌ Error clearing cart_items:', cartItemsError);
//     } else {
//       console.log('✅ Cleared cart_items');
//     }

//     console.log('🗑️  Clearing carts...');
//     const { error: cartsError } = await supabase
//       .from('carts')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (cartsError) {
//       console.error('❌ Error clearing carts:', cartsError);
//     } else {
//       console.log('✅ Cleared carts');
//     }

//     console.log('🗑️  Clearing wishlists...');
//     const { error: wishlistsError } = await supabase
//       .from('wishlists')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (wishlistsError) {
//       console.error('❌ Error clearing wishlists:', wishlistsError);
//     } else {
//       console.log('✅ Cleared wishlists');
//     }

//     console.log('🗑️  Clearing products...');
//     const { error: productsError } = await supabase
//       .from('products')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (productsError) {
//       console.error('❌ Error clearing products:', productsError);
//     } else {
//       console.log('✅ Cleared products');
//     }

//     console.log('🗑️  Clearing categories...');
//     const { error: categoriesError } = await supabase
//       .from('categories')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (categoriesError) {
//       console.error('❌ Error clearing categories:', categoriesError);
//     } else {
//       console.log('✅ Cleared categories');
//     }

//     console.log('🗑️  Clearing addresses...');
//     const { error: addressesError } = await supabase
//       .from('addresses')
//       .delete()
//       .neq('id', '00000000-0000-0000-0000-000000000000');
    
//     if (addressesError) {
//       console.error('❌ Error clearing addresses:', addressesError);
//     } else {
//       console.log('✅ Cleared addresses');
//     }

//     // Note: We don't clear profiles as they contain user data
//     console.log('ℹ️  Skipping profiles table (contains user data)');

//     console.log('\n🎉 Database cleanup completed successfully!');
//     console.log('\n📊 Summary:');
//     console.log('✅ Cleared order_items');
//     console.log('✅ Cleared orders');
//     console.log('✅ Cleared cart_items');
//     console.log('✅ Cleared carts');
//     console.log('✅ Cleared wishlists');
//     console.log('✅ Cleared products');
//     console.log('✅ Cleared categories');
//     console.log('✅ Cleared addresses');
//     console.log('ℹ️  Preserved profiles (user data)');
//     console.log('\n📝 Next steps:');
//     console.log('1. Run the seed script to populate with new data');
//     console.log('2. Update pages to use API data instead of mock data');

//   } catch (error) {
//     console.error('❌ Error during cleanup process:', error);
//     process.exit(1);
//   }
// }

// // Run the cleanup
// clearDatabase();
