"use client";
import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { AlertCircle, CheckCircle, Loader2, CreditCard } from "lucide-react";
import { clearCart } from "@/lib/services/cart.service";

interface CheckoutFormProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentIntent: any) => void;
  onCancel: () => void;
}

export default function CheckoutForm({
  amount,
  orderId,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Failed to submit payment details.");
        setProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + "/account/orders/" + orderId,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      // ✅ Handle different paymentIntent states
      if (paymentIntent) {
        if (
          paymentIntent.status === "requires_action" &&
          paymentIntent.next_action?.redirect_to_url
        ) {
          // Stripe needs the user to verify payment (3DS, OTP, etc.)
          window.location.href = paymentIntent.next_action.redirect_to_url.url!;
          return;
        }

        if (paymentIntent.status === "processing") {
          // Payment is processing
          setProcessing(true);
          setError(null);
          console.log("Payment is processing...");
          return;
        }

        if (paymentIntent.status === "succeeded") {
          setSucceeded(true);
          setProcessing(false);
          setTimeout(() => onSuccess(paymentIntent), 1500);
          return;
        }

        if (paymentIntent.status === "requires_payment_method") {
          setError("Payment failed. Please try another card.");
          setProcessing(false);
          return;
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Total Amount</span>
          <span className="text-3xl font-bold text-gray-900">
            ${amount.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-500">Order ID: {orderId}</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Details
          </h3>
        </div>
        <PaymentElement />
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Payment Failed</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {succeeded && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Payment Successful!</p>
            <p className="text-sm text-green-700 mt-1">Redirecting...</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing || succeeded}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || processing || succeeded}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : succeeded ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Paid
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
}
