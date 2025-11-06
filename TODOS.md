
---

# 🧠 Project TODO List

## 🛍️ Products & Filters (COMPLETED)

1. **Fix Featured Products Filter**

   * URL: `http://localhost:3000/products?featured=true`
   * Currently showing all products — make sure filtering by `featured=true` works properly.

2. **Footer Links Not Working**

   * Links to fix:

     * `Find Store`
     * `New & Featured`
     * `Best Sellers`
     * `Sale`
   * Add correct routing and pages or filters for these.

3. **Fix Product Page Search Reload**

   * When typing in search, page reloads.
   * Make it a **live search** (client-side filtering, no reload).

4. **Fix Filter Reload on Apply Filter**

   * Product filters are working but trigger a full reload — switch to **client-side filter logic**.

---

## 🧭 Navigation (COMPLETED ✓)

5. **Navbar Search Not Working**

   * Connect the navbar search bar with `/products` search filtering logic.

---

## 👤 Account & Orders (COMPLETED)

6. **Fetch Real User Orders**

   * Show orders from database using Supabase (user-specific).
   * Create **Order Details Page** to show order summary and items.

7. **Fix “Invalid Date” Issue in Account Profile**

   * “Member since Invalid Date” → properly format user’s `created_at` date.

---

## 💳 Payments & Shipping (COMPLETED)

8. **Implement Payment Method Integration**

   * Add **Stripe configuration** for checkout and payments.
   * Test flow with live & test keys.

9. **Add Shipping Provider Integration**

   * Example: **Flex**, **Leopard Courier**, or any mock shipping API.

---

## 📞 Support & Information Pages (COMPLETED)

10. **Create Static Pages**

    * `Support`
    * `Contact Us`
    * `FAQs`
    * `Shipping Info`
    * `Returns`

---

## ✉️ Newsletter (COMPLETED)

11. **Footer Newsletter Email Functionality**

    * Implement working email subscription (store in DB or external API like Mailchimp).
    * Add success/error toasts for user feedback.

---
