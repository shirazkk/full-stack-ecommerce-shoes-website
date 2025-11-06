import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-nike-gray-50 py-12">
      <div className="container-nike max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-nike-gray-900 mb-8 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-nike-gray-900">
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="text-nike-orange-500 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-nike-gray-900">Email Us</h3>
                  <p className="text-nike-gray-700">support@example.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-nike-orange-500 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-nike-gray-900">Call Us</h3>
                  <p className="text-nike-gray-700">+1 (234) 567-890</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="text-nike-orange-500 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-nike-gray-900">Our Office</h3>
                  <p className="text-nike-gray-700">123 Shoe Lane, Sneaker City, SC 12345</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-nike-gray-900">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input id="name" type="text" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Your Email
                  </label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Subject
                  </label>
                  <Input id="subject" type="text" placeholder="Regarding my order..." />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea id="message" rows={5} placeholder="Type your message here..." />
                </div>
                <Button type="submit" className="btn-nike-primary w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
