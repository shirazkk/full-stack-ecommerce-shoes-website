// /**
//  * Test script for forgot password functionality
//  * This script tests the complete password reset flow
//  */

// const { createClient } = require('@supabase/supabase-js');

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error('❌ Missing Supabase environment variables');
//   console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
//   process.exit(1);
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// async function testForgotPassword() {
//   console.log('🔍 Testing Forgot Password Functionality...\n');

//   // Test 1: Check if reset password function works
//   console.log('1️⃣ Testing password reset request...');
  
//   try {
//     const testEmail = 'test@example.com';
//     const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
//       redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?update=true`,
//     });

//     if (error) {
//       console.log('❌ Password reset request failed:', error.message);
      
//       // Check for common issues
//       if (error.message.includes('Invalid email')) {
//         console.log('💡 Issue: Email validation failed');
//       } else if (error.message.includes('rate limit')) {
//         console.log('💡 Issue: Rate limiting - try again later');
//       } else if (error.message.includes('configuration')) {
//         console.log('💡 Issue: Supabase email configuration');
//       }
//     } else {
//       console.log('✅ Password reset request successful');
//       console.log('📧 Email should be sent to:', testEmail);
//     }
//   } catch (error) {
//     console.log('❌ Unexpected error:', error.message);
//   }

//   // Test 2: Check environment variables
//   console.log('\n2️⃣ Checking environment configuration...');
  
//   const requiredEnvVars = [
//     'NEXT_PUBLIC_SUPABASE_URL',
//     'NEXT_PUBLIC_SUPABASE_ANON_KEY',
//     'NEXT_PUBLIC_APP_URL'
//   ];

//   let envIssues = [];
  
//   requiredEnvVars.forEach(varName => {
//     if (!process.env[varName]) {
//       envIssues.push(`❌ ${varName} is missing`);
//     } else {
//       console.log(`✅ ${varName} is set`);
//     }
//   });

//   if (envIssues.length > 0) {
//     console.log('\n❌ Environment Issues:');
//     envIssues.forEach(issue => console.log(issue));
//   }

//   // Test 3: Check Supabase connection
//   console.log('\n3️⃣ Testing Supabase connection...');
  
//   try {
//     const { data, error } = await supabase.auth.getSession();
//     if (error) {
//       console.log('❌ Supabase connection failed:', error.message);
//     } else {
//       console.log('✅ Supabase connection successful');
//     }
//   } catch (error) {
//     console.log('❌ Connection error:', error.message);
//   }

//   // Test 4: Check redirect URL format
//   console.log('\n4️⃣ Checking redirect URL configuration...');
  
//   const appUrl = process.env.NEXT_PUBLIC_APP_URL;
//   if (appUrl) {
//     console.log(`✅ App URL: ${appUrl}`);
    
//     // Check if URL is properly formatted
//     try {
//       new URL(appUrl);
//       console.log('✅ App URL is valid');
//     } catch (error) {
//       console.log('❌ App URL is invalid:', error.message);
//     }
//   } else {
//     console.log('❌ NEXT_PUBLIC_APP_URL is not set');
//   }

//   console.log('\n📋 Forgot Password Checklist:');
//   console.log('□ User clicks "Forgot password?" link on login page');
//   console.log('□ User enters email and clicks "Send Reset Link"');
//   console.log('□ Supabase sends password reset email');
//   console.log('□ User clicks link in email');
//   console.log('□ User is redirected to /reset-password?update=true');
//   console.log('□ User enters new password and confirms');
//   console.log('□ Password is updated successfully');
//   console.log('□ User is redirected to login page');

//   console.log('\n🔧 Common Issues & Solutions:');
//   console.log('1. Email not received:');
//   console.log('   - Check spam folder');
//   console.log('   - Verify email configuration in Supabase dashboard');
//   console.log('   - Check rate limiting');
  
//   console.log('\n2. Redirect URL issues:');
//   console.log('   - Ensure NEXT_PUBLIC_APP_URL is set correctly');
//   console.log('   - Check if URL matches your domain');
//   console.log('   - Verify redirect URL is whitelisted in Supabase');
  
//   console.log('\n3. Authentication issues:');
//   console.log('   - Check if user exists in database');
//   console.log('   - Verify email is confirmed');
//   console.log('   - Check Supabase auth settings');

//   console.log('\n✨ Test completed!');
// }

// // Run the test
// testForgotPassword().catch(console.error);
