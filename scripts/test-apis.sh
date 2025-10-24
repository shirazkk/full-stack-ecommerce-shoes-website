#!/bin/bash

# Nike E-commerce API Testing Script
# Tests all endpoints using curl commands

BASE_URL="http://localhost:3000"
PASSED=0
FAILED=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_api() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    
    echo -e "\n${BLUE}🧪 Testing: $test_name${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED: $test_name (Status: $http_code)${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        echo -e "${RED}   Expected: $expected_status, Got: $http_code${NC}"
        echo -e "${RED}   Response: $body${NC}"
        ((FAILED++))
    fi
}

echo -e "${YELLOW}🚀 Starting Nike E-commerce API Tests${NC}"
echo "====================================="

# Authentication Tests
echo -e "\n${YELLOW}📝 AUTHENTICATION TESTS${NC}"
echo "------------------------"

test_api "Auth Signup" "POST" "/api/auth/signup" '{"email":"test@example.com","password":"Password123","fullName":"Test User"}' "200"
test_api "Auth Signin (Admin)" "POST" "/api/auth/signin" '{"email":"admin@nike.com","password":"admin123"}' "200"
test_api "Auth Signout" "POST" "/api/auth/signout" "{}" "200"

# Products Tests
echo -e "\n${YELLOW}🛍️ PRODUCTS TESTS${NC}"
echo "-----------------"

test_api "Products - Get All" "GET" "/api/products" "" "200"
test_api "Products - With Filters" "GET" "/api/products?category=mens-shoes&brand=Nike&limit=5" "" "200"
test_api "Products - Get Single" "GET" "/api/products/nike-air-max-270" "" "200"

# Cart Tests
echo -e "\n${YELLOW}🛒 CART TESTS${NC}"
echo "-------------"

# Note: Cart tests require authentication - these will fail without proper session management
test_api "Cart - Get Cart" "GET" "/api/cart" "" "401"
test_api "Cart - Add Item" "POST" "/api/cart" '{"productId":"330320c2-03b2-4b97-9b2b-8dec61eb569c","quantity":2,"size":"M","color":"Black"}' "401"

# Orders Tests
echo -e "\n${YELLOW}📦 ORDERS TESTS${NC}"
echo "----------------"

# Note: Orders tests require authentication - these will fail without proper session management
test_api "Orders - Get Orders" "GET" "/api/orders" "" "401"
test_api "Orders - Create Order" "POST" "/api/orders" '{
  "items": [
    {
      "product_id": "330320c2-03b2-4b97-9b2b-8dec61eb569c",
      "quantity": 1,
      "size": "M",
      "color": "Black",
      "price": 120.00
    }
  ],
  "shippingAddress": {
    "full_name": "Test User",
    "address_line1": "123 Test St",
    "city": "Test City",
    "state": "TS",
    "postal_code": "12345",
    "country": "USA",
    "phone": "+1234567890"
  },
  "subtotal": 120.00,
  "tax": 9.60,
  "shipping": 10.00,
  "total": 139.60,
  "stripePaymentIntentId": "pi_test_123456789"
}' "401"

# Webhook Tests
echo -e "\n${YELLOW}💳 WEBHOOK TESTS${NC}"
echo "-----------------"

test_api "Stripe Webhook" "POST" "/api/webhooks/stripe" '{
  "id": "evt_test_webhook",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_123456789",
      "object": "payment_intent",
      "amount": 13960,
      "currency": "usd",
      "status": "succeeded",
      "metadata": {
        "order_id": "test_order_123"
      }
    }
  }
}' "400"

# Print Results
echo -e "\n${YELLOW}📊 TEST RESULTS${NC}"
echo "=================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"

total=$((PASSED + FAILED))
if [ $total -gt 0 ]; then
    success_rate=$((PASSED * 100 / total))
    echo -e "${BLUE}📈 Success Rate: $success_rate%${NC}"
fi

echo -e "\n${YELLOW}🎯 Test completed!${NC}"

# Exit with error code if any tests failed
if [ $FAILED -gt 0 ]; then
    exit 1
fi
