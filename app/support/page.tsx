import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-nike-gray-50 py-12">
      <div className="container-nike max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-nike-gray-900 mb-8 text-center">
          Support Center
        </h1>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-nike-gray-900">
              How Can We Help You?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-4">
            <p>
              Welcome to our Support Center. We&apos;re here to assist you with any questions or issues you might have.
              Below are some common resources and ways to get in touch.
            </p>
            <p>
              For immediate answers, please check our <Link href="/faq" className="text-nike-orange-500 hover:underline">FAQs</Link> section.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold text-nike-gray-900">
                <Mail className="mr-3 text-nike-orange-500" /> Email Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-nike-gray-700 space-y-3">
              <p>Send us an email with your questions, and we&apos;ll get back to you as soon as possible.</p>
              <Button asChild className="btn-nike-primary w-full">
                <a href="mailto:support@example.com">Send Email</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold text-nike-gray-900">
                <Phone className="mr-3 text-nike-orange-500" /> Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-nike-gray-700 space-y-3">
              <p>Speak directly with a support representative during business hours.</p>
              <Button asChild className="btn-nike-primary w-full">
                <a href="tel:+1234567890">Call Us: +1 (234) 567-890</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-nike-gray-900">
              <MessageSquare className="mr-3 text-nike-orange-500" /> Live Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-3">
            <p>Chat with our support team in real-time for quick assistance.</p>
            <Button className="btn-nike-primary w-full" disabled>
              Chat Now (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
