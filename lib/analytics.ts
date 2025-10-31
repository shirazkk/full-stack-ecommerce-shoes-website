// Analytics tracking utility
// Supports Google Analytics 4 and custom event tracking

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
  value?: number;
}

interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
}

interface EcommerceEvent {
  event_name: string;
  currency: string;
  value: number;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}

class Analytics {
  private isEnabled: boolean;
  private gtag: ((...args: any[]) => void) | null = null;

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && !!window.gtag;

    if (this.isEnabled && typeof window !== 'undefined') {
      this.gtag = window.gtag ?? null;

    }
  }

  /**
   * Track a page view
   */
  trackPageView(event: PageViewEvent) {
    if (!this.isEnabled || !this.gtag) return;

    this.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_title: event.page_title,
      page_location: event.page_location,
      page_path: event.page_path,
    });
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled || !this.gtag) return;

    this.gtag('event', event.name, {
      ...event.parameters,
      value: event.value,
    });
  }

  /**
   * Track ecommerce events
   */
  trackEcommerceEvent(event: EcommerceEvent) {
    if (!this.isEnabled || !this.gtag) return;

    this.gtag('event', event.event_name, {
      currency: event.currency,
      value: event.value,
      items: event.items,
    });
  }

  /**
   * Track product views
   */
  trackProductView(productId: string, productName: string, category: string, price: number) {
    this.trackEvent({
      name: 'view_item',
      parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
        value: price,
        currency: 'USD',
      },
    });
  }

  /**
   * Track add to cart
   */
  trackAddToCart(productId: string, productName: string, category: string, price: number, quantity: number = 1) {
    this.trackEcommerceEvent({
      event_name: 'add_to_cart',
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        category,
        quantity,
        price,
      }],
    });
  }

  /**
   * Track remove from cart
   */
  trackRemoveFromCart(productId: string, productName: string, category: string, price: number, quantity: number = 1) {
    this.trackEcommerceEvent({
      event_name: 'remove_from_cart',
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        category,
        quantity,
        price,
      }],
    });
  }

  /**
   * Track begin checkout
   */
  trackBeginCheckout(items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>, totalValue: number) {
    this.trackEcommerceEvent({
      event_name: 'begin_checkout',
      currency: 'USD',
      value: totalValue,
      items,
    });
  }

  /**
   * Track purchase
   */
  trackPurchase(
    transactionId: string,
    items: Array<{
      item_id: string;
      item_name: string;
      category: string;
      quantity: number;
      price: number;
    }>,
    totalValue: number,
    tax?: number,
    shipping?: number
  ) {
    this.trackEcommerceEvent({
      event_name: 'purchase',
      currency: 'USD',
      value: totalValue,
      items,
    });

    // Also track as a custom event with transaction details
    this.trackEvent({
      name: 'purchase_completed',
      parameters: {
        transaction_id: transactionId,
        value: totalValue,
        tax,
        shipping,
        item_count: items.length,
      },
      value: totalValue,
    });
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string, resultsCount?: number) {
    this.trackEvent({
      name: 'search',
      parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
      },
    });
  }

  /**
   * Track user registration
   */
  trackSignUp(method: string = 'email') {
    this.trackEvent({
      name: 'sign_up',
      parameters: {
        method,
      },
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: string = 'email') {
    this.trackEvent({
      name: 'login',
      parameters: {
        method,
      },
    });
  }

  /**
   * Track wishlist actions
   */
  trackAddToWishlist(productId: string, productName: string, category: string) {
    this.trackEvent({
      name: 'add_to_wishlist',
      parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
      },
    });
  }

  trackRemoveFromWishlist(productId: string, productName: string, category: string) {
    this.trackEvent({
      name: 'remove_from_wishlist',
      parameters: {
        item_id: productId,
        item_name: productName,
        item_category: category,
      },
    });
  }

  /**
   * Track form submissions
   */
  trackFormSubmit(formName: string, success: boolean = true) {
    this.trackEvent({
      name: 'form_submit',
      parameters: {
        form_name: formName,
        success,
      },
    });
  }

  /**
   * Track errors
   */
  trackError(error: string, fatal: boolean = false) {
    this.trackEvent({
      name: 'exception',
      parameters: {
        description: error,
        fatal,
      },
    });
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export individual tracking functions for convenience
export const {
  trackPageView,
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackSearch,
  trackSignUp,
  trackLogin,
  trackAddToWishlist,
  trackRemoveFromWishlist,
  trackFormSubmit,
  trackError,
} = analytics;

// React hook for analytics
export function useAnalytics() {
  return analytics;
}

// Server-side analytics (for API routes)
export function trackServerEvent(event: AnalyticsEvent) {
  // In a real implementation, you might send this to a server-side analytics service
  console.log('Server analytics event:', event);
}

// Initialize analytics (call this in your app)
export function initializeAnalytics() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    // Google Analytics is already initialized via the script in layout.tsx
    console.log('Analytics initialized');
  }
}
