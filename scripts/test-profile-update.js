// // Test script to verify profile update functionality
// const { createClient } = require('@supabase/supabase-js');

// // You'll need to replace these with your actual Supabase credentials
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   console.error('Missing Supabase credentials');
//   process.exit(1);
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// async function testProfileUpdate() {
//   try {
//     console.log('Testing profile update...');
    
//     // Test if we can read from profiles table
//     const { data: profiles, error: readError } = await supabase
//       .from('profiles')
//       .select('*')
//       .limit(1);
    
//     if (readError) {
//       console.error('Error reading profiles:', readError);
//       return;
//     }
    
//     console.log('Successfully read profiles:', profiles);
    
//     // Test if we can update a profile (this will fail if no profiles exist)
//     if (profiles && profiles.length > 0) {
//       const testProfile = profiles[0];
//       console.log('Testing update on profile:', testProfile.id);
      
//       const { data: updateData, error: updateError } = await supabase
//         .from('profiles')
//         .update({
//           full_name: 'Test Update ' + Date.now(),
//           phone: '123-456-7890'
//         })
//         .eq('id', testProfile.id)
//         .select();
      
//       if (updateError) {
//         console.error('Error updating profile:', updateError);
//       } else {
//         console.log('Successfully updated profile:', updateData);
//       }
//     }
    
//   } catch (error) {
//     console.error('Test failed:', error);
//   }
// }

// testProfileUpdate();
