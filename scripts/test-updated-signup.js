/**
 * Test script for updated signup form with required full name and optional phone
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignupForm() {
  console.log('🔍 Testing Updated Signup Form...\n');

  // Test 1: Required full name validation
  console.log('1️⃣ Testing required full name validation...');
  
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    const testFullName = 'John Doe';
    const testPhone = '(555) 123-4567';

    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testFullName,
          phone: testPhone,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=signup`,
      },
    });

    if (error) {
      console.log('❌ Signup failed:', error.message);
    } else {
      console.log('✅ Signup successful with full name and phone');
      console.log('📧 Confirmation email should be sent to:', testEmail);
      console.log('👤 Full name:', testFullName);
      console.log('📞 Phone:', testPhone);
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  // Test 2: Test without phone (optional field)
  console.log('\n2️⃣ Testing signup without phone number...');
  
  try {
    const testEmail2 = `test2-${Date.now()}@example.com`;
    const testPassword2 = 'testpassword123';
    const testFullName2 = 'Jane Smith';

    const { data, error } = await supabase.auth.signUp({
      email: testEmail2,
      password: testPassword2,
      options: {
        data: {
          full_name: testFullName2,
          // phone is optional, so we don't include it
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?type=signup`,
      },
    });

    if (error) {
      console.log('❌ Signup failed:', error.message);
    } else {
      console.log('✅ Signup successful without phone number');
      console.log('📧 Confirmation email should be sent to:', testEmail2);
      console.log('👤 Full name:', testFullName2);
      console.log('📞 Phone: Not provided (optional)');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n📋 Updated Signup Form Checklist:');
  console.log('□ Full Name field is required (marked with *)');
  console.log('□ Full Name validation: 2-50 characters, letters and spaces only');
  console.log('□ Email field is required (marked with *)');
  console.log('□ Password field is required (marked with *)');
  console.log('□ Confirm Password field is required (marked with *)');
  console.log('□ Phone Number field is optional (marked as Optional)');
  console.log('□ Phone Number validation: 10+ digits if provided');
  console.log('□ Form shows validation errors for each field');
  console.log('□ Form prevents submission with invalid data');
  console.log('□ Form submits with fullName, email, password, and optional phone');

  console.log('\n🔧 Form Validation Rules:');
  console.log('1. Full Name:');
  console.log('   - Required field');
  console.log('   - Minimum 2 characters');
  console.log('   - Maximum 50 characters');
  console.log('   - Only letters and spaces allowed');
  
  console.log('\n2. Email:');
  console.log('   - Required field');
  console.log('   - Valid email format');
  
  console.log('\n3. Password:');
  console.log('   - Required field');
  console.log('   - Minimum 6 characters');
  
  console.log('\n4. Confirm Password:');
  console.log('   - Required field');
  console.log('   - Must match password');
  
  console.log('\n5. Phone Number:');
  console.log('   - Optional field');
  console.log('   - If provided, must be valid phone format');
  console.log('   - Minimum 10 digits');

  console.log('\n✨ Test completed!');
  console.log('\n💡 To test the updated form:');
  console.log('1. Go to http://localhost:3001/signup');
  console.log('2. Try submitting without full name - should show error');
  console.log('3. Try submitting with invalid phone - should show error');
  console.log('4. Fill out all required fields and submit');
  console.log('5. Check that full name and phone are saved to profile');
}

// Run the test
testSignupForm().catch(console.error);
