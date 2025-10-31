"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import {
  validateCheckoutForm,
  sanitizeCheckoutForm,
  type CheckoutFormData,
} from "@/lib/validations/checkout";
import { insertAddress } from "@/lib/services/address.service";
import { Address } from "@/types";

// Import the new components
import ShippingInfo from "@/components/ShippingInfo";
import ShippingMethod from "@/components/ShippingMethod";
import PaymentInfo from "@/components/PaymentInfo";
import CheckoutLoading from "./loading";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, initialized, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    shippingMethod: "standard",
    paymentMethod: "card",
    saveInfo: false,
    newsletter: false,
  });

  useEffect(() => {
    if (!initialized) return; // wait until cart is loaded at least once

    if (cartItems.length === 0 && !loading) {
      toast({
        title: "Your cart is empty",
        description: "Add some products to your cart before checkout.",
        variant: "destructive",
      });
      router.replace("/products");
    }
  }, [initialized, cartItems, router, toast, loading]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.sale_price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping =
    form.shippingMethod === "express"
      ? 15
      : form.shippingMethod === "overnight"
      ? 25
      : 0;
  const tax = +(subtotal * 0.08).toFixed(2); // 8% tax
  const total = +(subtotal + shipping + tax).toFixed(2);

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const validation = validateCheckoutForm(form);
    if (!validation.success) {
      setFormErrors((validation.errors as Record<string, string[]>) || {});
      return false;
    }
    setFormErrors({});
    return true;
  };

  const sanitizeForm = (): CheckoutFormData => sanitizeCheckoutForm(form);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateForm()) {
        toast({
          title: "Please fix the errors below",
          description: "All shipping information must be valid to continue.",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateForm()) {
      toast({
        title: "Please fix the errors below",
        description: "All form fields must be valid to place your order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const sanitizedData = sanitizeForm();

      // Build order items payload
      const orderItems = cartItems.map((item) => ({
        product_id: item.product_id ?? item.product?.id, // prefer product_id, fallback to product.id
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product?.sale_price ?? item.product?.price ?? 0,
      }));

      // Basic validation: ensure product ids exist
      for (const it of orderItems) {
        if (!it.product_id) {
          throw new Error("One of the cart items is missing a product id.");
        }
      }

      // Build shipping address payload (matches your backend Address structure)
      const shippingAddress = {
        full_name:
          `${sanitizedData.firstName} ${sanitizedData.lastName}`.trim(),
        address_line1: sanitizedData.address,
        address_line2: (sanitizedData as any).address2 ?? "",
        city: sanitizedData.city,
        state: sanitizedData.state,
        postal_code: sanitizedData.zipCode,
        country: sanitizedData.country,
        phone: sanitizedData.phone,
      };

      // Call your API
      const resp = await axios.post("/api/orders", {
        items: orderItems,
        shippingAddress,
        subtotal,
        tax,
        shipping,
        total,
        // stripePaymentIntentId: optional - will be created on server if you integrate payments
      });

      if (resp.status === 201) {
        toast({
          title: "Order Placed Successfully!",
          description:
            "Thank you for your purchase. You will receive a confirmation email shortly.",
        });
        if (form.saveInfo === true) {
          try {
            await insertAddress(shippingAddress as Address);
          } catch (err: any) {
            toast({
              title: "Failed to Save Address",
              description: err.message,
            });
            console.error("Error saving address:", err.message);
          }
        }
        // Redirect user to orders page
        router.push("/account/orders");
        // Clear cart
        await clearCart();
      } else {
        // unexpected status
        throw new Error(resp.data?.error || "Failed to create order");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast({
        title: "Order Failed",
        description:
          err?.response?.data?.error || err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while cart is being fetched
  if (!initialized) {
    return <CheckoutLoading />;
  }

  return (
    <div className="min-h-screen bg-nike-gray-50">
      <div className="container-nike py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-nike-display text-4xl font-bold text-nike-gray-900">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= currentStep
                        ? "bg-nike-orange-500 text-white"
                        : "bg-nike-gray-200 text-nike-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        step < currentStep
                          ? "bg-nike-orange-500"
                          : "bg-nike-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Shipping Info */}
            {currentStep === 1 && (
              <ShippingInfo
                form={form}
                formErrors={formErrors}
                onInputChange={handleInputChange}
              />
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === 2 && (
              <ShippingMethod form={form} onInputChange={handleInputChange} />
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <PaymentInfo form={form} onInputChange={handleInputChange} />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext} className="btn-nike-primary">
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-nike-primary"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Complete Order"
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const price =
                      item.product?.sale_price ?? item.product?.price ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-nike-gray-100">
                          {item.product?.images?.[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-nike-gray-900 truncate">
                            {item.product?.name}
                          </h4>
                          <p className="text-xs text-nike-gray-600">
                            Size: {item.size} • Color: {item.color}
                          </p>
                          <p className="text-xs text-nike-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold">
                          ${(price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
