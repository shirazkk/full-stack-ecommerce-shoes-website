"use client";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getStripe } from "@/lib/stripe/client";
import CheckoutForm from "@/components/CheckoutForm";
import { StripeElementsOptions } from "@stripe/stripe-js";

interface StripePaymentFlowProps {
  orderData: { amount: number; orderId: string };
  onPaymentSuccess: (paymentIntentId: string) => void;
}

const stripePromise = getStripe();

export default function StripePaymentFlow({
  orderData,
  onPaymentSuccess,
}: StripePaymentFlowProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: orderData.amount,
          orderId: orderData.orderId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log("Payment succeeded:", paymentIntent);
    setPaymentComplete(true);

    // Call the parent callback with payment intent ID
    onPaymentSuccess(paymentIntent.id);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this payment?")) {
      // You can redirect back to cart or previous step
      window.history.back();
    }
  };

  const handleRetry = () => {
    setError(null);
    setPaymentComplete(false);
    createPaymentIntent();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Setting up payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Setup Failed</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Payment Complete!
          </h2>
          <p className="text-gray-600 text-center">
            Your payment of{" "}
            <span className="font-bold">${orderData.amount.toFixed(2)}</span>{" "}
            has been processed successfully.
          </p>
          <div className="w-full bg-gray-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-gray-900">{orderData.orderId}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your orders...
          </p>
        </div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#2563eb",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Payment
        </h2>
        <p className="text-gray-600">
          Enter your payment details below to complete your purchase securely.
        </p>
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            amount={orderData.amount}
            orderId={orderData.orderId}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secured by Stripe • Your payment information is encrypted</span>
        </div>
      </div>
    </div>
  );
}
