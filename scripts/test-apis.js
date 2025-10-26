// #!/usr/bin/env node

// /**
//  * Comprehensive API Testing Script for Nike E-commerce Platform
//  * Tests all endpoints: Auth, Products, Cart, Orders, Webhooks
//  */

// const https = require('https');
// const http = require('http');

// // Configuration
// const BASE_URL = 'http://localhost:3000';
// const TEST_USER = {
//   email: 'test@example.com',
//   password: 'password123',
//   fullName: 'Test User'
// };

// const ADMIN_USER = {
//   email: 'admin@nike.com',
//   password: 'admin123'
// };

// // Test results storage
// const results = {
//   passed: 0,
//   failed: 0,
//   tests: []
// };

// // Utility function to make HTTP requests
// function makeRequest(method, path, data = null, headers = {}) {
//   return new Promise((resolve, reject) => {
//     const url = new URL(path, BASE_URL);
//     const options = {
//       hostname: url.hostname,
//       port: url.port || 3000,
//       path: url.pathname + url.search,
//       method: method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers
//       }
//     };

//     const req = http.request(options, (res) => {
//       let body = '';
//       res.on('data', (chunk) => body += chunk);
//       res.on('end', () => {
//         try {
//           const jsonBody = body ? JSON.parse(body) : {};
//           resolve({
//             status: res.statusCode,
//             headers: res.headers,
//             body: jsonBody
//           });
//         } catch (e) {
//           resolve({
//             status: res.statusCode,
//             headers: res.headers,
//             body: body
//           });
//         }
//       });
//     });

//     req.on('error', reject);

//     if (data) {
//       req.write(JSON.stringify(data));
//     }

//     req.end();
//   });
// }

// // Test runner
// async function runTest(name, testFn) {
//   try {
//     console.log(`\n🧪 Testing: ${name}`);
//     const result = await testFn();
    
//     if (result.success) {
//       console.log(`✅ PASSED: ${name}`);
//       results.passed++;
//     } else {
//       console.log(`❌ FAILED: ${name}`);
//       console.log(`   Error: ${result.error}`);
//       results.failed++;
//     }
    
//     results.tests.push({
//       name,
//       success: result.success,
//       error: result.error,
//       response: result.response
//     });
    
//     return result;
//   } catch (error) {
//     console.log(`❌ FAILED: ${name} - ${error.message}`);
//     results.failed++;
//     results.tests.push({
//       name,
//       success: false,
//       error: error.message
//     });
//     return { success: false, error: error.message };
//   }
// }

// // Test functions
// async function testAuthSignup() {
//   const response = await makeRequest('POST', '/api/auth/signup', TEST_USER);
  
//   if (response.status === 201 && response.body.user) {
//     return { success: true, response };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 201, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testAuthSignin() {
//   const response = await makeRequest('POST', '/api/auth/signin', ADMIN_USER);
  
//   if (response.status === 200 && response.body.user) {
//     return { success: true, response, user: response.body.user };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testAuthSignout() {
//   const response = await makeRequest('POST', '/api/auth/signout');
  
//   if (response.status === 200) {
//     return { success: true, response };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testProductsGetAll() {
//   const response = await makeRequest('GET', '/api/products');
  
//   if (response.status === 200 && response.body.products) {
//     return { success: true, response, products: response.body.products };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testProductsWithFilters() {
//   const response = await makeRequest('GET', '/api/products?category=mens-shoes&brand=Nike&limit=5');
  
//   if (response.status === 200 && response.body.products) {
//     return { success: true, response };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testProductsSingle() {
//   const response = await makeRequest('GET', '/api/products/nike-air-max-270');
  
//   if (response.status === 200 && response.body.id) {
//     return { success: true, response, product: response.body };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testCartGet() {
//   // First login to get session
//   const loginResponse = await makeRequest('POST', '/api/auth/signin', ADMIN_USER);
  
//   if (loginResponse.status !== 200) {
//     return { 
//       success: false, 
//       error: `Login failed: ${loginResponse.status}` 
//     };
//   }

//   // Test cart GET (will create cart if doesn't exist)
//   const response = await makeRequest('GET', '/api/cart');
  
//   if (response.status === 200 && response.body.cart) {
//     return { success: true, response, cart: response.body.cart };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testCartAddItem() {
//   // First login to get session
//   const loginResponse = await makeRequest('POST', '/api/auth/signin', ADMIN_USER);
  
//   if (loginResponse.status !== 200) {
//     return { 
//       success: false, 
//       error: `Login failed: ${loginResponse.status}` 
//     };
//   }

//   // Add item to cart
//   const cartItem = {
//     productId: '330320c2-03b2-4b97-9b2b-8dec61eb569c',
//     quantity: 2,
//     size: 'M',
//     color: 'Black'
//   };

//   const response = await makeRequest('POST', '/api/cart', cartItem);
  
//   if (response.status === 200 && response.body.cartItem) {
//     return { success: true, response, cartItem: response.body.cartItem };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testOrdersGet() {
//   // First login to get session
//   const loginResponse = await makeRequest('POST', '/api/auth/signin', ADMIN_USER);
  
//   if (loginResponse.status !== 200) {
//     return { 
//       success: false, 
//       error: `Login failed: ${loginResponse.status}` 
//     };
//   }

//   const response = await makeRequest('GET', '/api/orders');
  
//   if (response.status === 200) {
//     return { success: true, response, orders: response.body };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testOrdersCreate() {
//   // First login to get session
//   const loginResponse = await makeRequest('POST', '/api/auth/signin', ADMIN_USER);
  
//   if (loginResponse.status !== 200) {
//     return { 
//       success: false, 
//       error: `Login failed: ${loginResponse.status}` 
//     };
//   }

//   const orderData = {
//     items: [
//       {
//         product_id: '330320c2-03b2-4b97-9b2b-8dec61eb569c',
//         quantity: 1,
//         size: 'M',
//         color: 'Black',
//         price: 120.00
//       }
//     ],
//     shippingAddress: {
//       full_name: 'Test User',
//       address_line1: '123 Test St',
//       city: 'Test City',
//       state: 'TS',
//       postal_code: '12345',
//       country: 'USA',
//       phone: '+1234567890'
//     },
//     subtotal: 120.00,
//     tax: 9.60,
//     shipping: 10.00,
//     total: 139.60,
//     stripePaymentIntentId: 'pi_test_123456789'
//   };

//   const response = await makeRequest('POST', '/api/orders', orderData);
  
//   if (response.status === 201 && response.body.id) {
//     return { success: true, response, order: response.body };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 201, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testStripeWebhook() {
//   const webhookData = {
//     id: 'evt_test_webhook',
//     object: 'event',
//     type: 'payment_intent.succeeded',
//     data: {
//       object: {
//         id: 'pi_test_123456789',
//         object: 'payment_intent',
//         amount: 13960,
//         currency: 'usd',
//         status: 'succeeded',
//         metadata: {
//           order_id: 'test_order_123'
//         }
//       }
//     }
//   };

//   const response = await makeRequest('POST', '/api/webhooks/stripe', webhookData);
  
//   if (response.status === 200) {
//     return { success: true, response };
//   }
  
//   return { 
//     success: false, 
//     error: `Expected 200, got ${response.status}. Body: ${JSON.stringify(response.body)}` 
//   };
// }

// async function testAdminAccess() {
//   // First login as admin
//   const loginResponse = await makeRequest('POST', '/api/auth/signin', ADMIN_USER);
  
//   if (loginResponse.status !== 200) {
//     return { 
//       success: false, 
//       error: `Admin login failed: ${loginResponse.status}` 
//     };
//   }

//   // Test admin dashboard access (this would be a page request, but we'll test the auth)
//   if (loginResponse.body.user && loginResponse.body.user.role === 'admin') {
//     return { success: true, response: loginResponse };
//   }
  
//   return { 
//     success: false, 
//     error: `User is not admin. Role: ${loginResponse.body.user?.role}` 
//   };
// }

// // Main test runner
// async function runAllTests() {
//   console.log('🚀 Starting Nike E-commerce API Tests');
//   console.log('=====================================');

//   // Authentication Tests
//   console.log('\n📝 AUTHENTICATION TESTS');
//   console.log('------------------------');
  
//   await runTest('Auth Signup', testAuthSignup);
//   await runTest('Auth Signin (Admin)', testAuthSignin);
//   await runTest('Auth Signout', testAuthSignout);

//   // Products Tests
//   console.log('\n🛍️ PRODUCTS TESTS');
//   console.log('-----------------');
  
//   await runTest('Products - Get All', testProductsGetAll);
//   await runTest('Products - With Filters', testProductsWithFilters);
//   await runTest('Products - Get Single', testProductsSingle);

//   // Cart Tests
//   console.log('\n🛒 CART TESTS');
//   console.log('-------------');
  
//   await runTest('Cart - Get Cart', testCartGet);
//   await runTest('Cart - Add Item', testCartAddItem);

//   // Orders Tests
//   console.log('\n📦 ORDERS TESTS');
//   console.log('----------------');
  
//   await runTest('Orders - Get Orders', testOrdersGet);
//   await runTest('Orders - Create Order', testOrdersCreate);

//   // Webhook Tests
//   console.log('\n💳 WEBHOOK TESTS');
//   console.log('-----------------');
  
//   await runTest('Stripe Webhook', testStripeWebhook);

//   // Admin Tests
//   console.log('\n👑 ADMIN TESTS');
//   console.log('---------------');
  
//   await runTest('Admin Access', testAdminAccess);

//   // Print Results
//   console.log('\n📊 TEST RESULTS');
//   console.log('================');
//   console.log(`✅ Passed: ${results.passed}`);
//   console.log(`❌ Failed: ${results.failed}`);
//   console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

//   if (results.failed > 0) {
//     console.log('\n❌ FAILED TESTS:');
//     results.tests
//       .filter(test => !test.success)
//       .forEach(test => {
//         console.log(`   - ${test.name}: ${test.error}`);
//       });
//   }

//   console.log('\n🎯 Test completed!');
  
//   // Exit with error code if any tests failed
//   if (results.failed > 0) {
//     process.exit(1);
//   }
// }

// // Run the tests
// runAllTests().catch(error => {
//   console.error('💥 Test runner failed:', error);
//   process.exit(1);
// });
