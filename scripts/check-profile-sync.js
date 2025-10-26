// // Script to check if profile data is synchronized between auth.users and profiles tables
// const { createClient } = require('@supabase/supabase-js');

// // You'll need to replace these with your actual Supabase credentials
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin access

// if (!supabaseUrl || !supabaseKey) {
//   console.error('Missing Supabase credentials');
//   console.log('Make sure to set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
//   process.exit(1);
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// async function checkProfileSync() {
//   try {
//     console.log('Checking profile synchronization...\n');
    
//     // Get all users from auth.users
//     const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
//     if (authError) {
//       console.error('Error fetching auth users:', authError);
//       return;
//     }
    
//     console.log(`Found ${authUsers.users.length} users in auth.users table\n`);
    
//     // Get all profiles
//     const { data: profiles, error: profilesError } = await supabase
//       .from('profiles')
//       .select('*');
    
//     if (profilesError) {
//       console.error('Error fetching profiles:', profilesError);
//       return;
//     }
    
//     console.log(`Found ${profiles.length} profiles in profiles table\n`);
    
//     // Check for mismatches
//     console.log('Checking for synchronization issues...\n');
    
//     for (const authUser of authUsers.users) {
//       const profile = profiles.find(p => p.id === authUser.id);
      
//       if (!profile) {
//         console.log(`❌ User ${authUser.email} (${authUser.id}) has no profile record`);
//         console.log(`   Auth data: ${authUser.user_metadata?.full_name || 'No name'}`);
//         console.log('');
//       } else {
//         const authName = authUser.user_metadata?.full_name || authUser.user_metadata?.name;
//         const profileName = profile.full_name;
        
//         if (authName !== profileName) {
//           console.log(`⚠️  User ${authUser.email} has mismatched names:`);
//           console.log(`   Auth: ${authName || 'No name'}`);
//           console.log(`   Profile: ${profileName || 'No name'}`);
//           console.log('');
//         } else {
//           console.log(`✅ User ${authUser.email} is synchronized`);
//         }
//       }
//     }
    
//     // Check for orphaned profiles
//     console.log('\nChecking for orphaned profiles...\n');
//     for (const profile of profiles) {
//       const authUser = authUsers.users.find(u => u.id === profile.id);
//       if (!authUser) {
//         console.log(`❌ Profile for ${profile.email} has no corresponding auth user`);
//       }
//     }
    
//   } catch (error) {
//     console.error('Error checking profile sync:', error);
//   }
// }

// checkProfileSync();
