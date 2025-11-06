import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-nike-gray-50 py-12">
      <div className="container-nike max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-nike-gray-900 mb-8 text-center">
          Returns & Exchanges
        </h1>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-nike-gray-900">
              Our Return Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-4">
            <p>
              We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a straightforward return and exchange policy.
            </p>
            <h3 className="text-xl font-semibold text-nike-gray-900">Eligibility:</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Items must be returned within <strong>30 days</strong> of the purchase date.</li>
              <li>Items must be unworn, unwashed, and in their original condition with all tags attached.</li>
              <li>Original packaging must be intact.</li>
              <li>Proof of purchase (order number or receipt) is required.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-nike-gray-900">
              How to Initiate a Return or Exchange
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-4">
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>
                <strong>Contact Us:</strong> Please reach out to our customer support team at <Link href="/contact" className="text-nike-orange-500 hover:underline">support@example.com</Link> or call us at <a href="tel:+1234567890" className="text-nike-orange-500 hover:underline">+1 (234) 567-890</a> to initiate your return. Provide your order number and the reason for the return.
              </li>
              <li>
                <strong>Receive Instructions:</strong> Our team will provide you with detailed instructions and a return shipping label (if applicable).
              </li>
              <li>
                <strong>Package Your Item:</strong> Securely package the item(s) in their original packaging, including all tags and accessories.
              </li>
              <li>
                <strong>Ship It Back:</strong> Drop off your package at the designated shipping carrier location.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-nike-gray-900">
              Refunds & Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-4">
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
            </p>
            <p>
              If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment, within 7-10 business days.
            </p>
            <p>
              Exchanges will be processed and shipped out after the returned item has been received and inspected.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
