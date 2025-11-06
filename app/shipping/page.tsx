import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ShippingInfoPage() {
  return (
    <div className="min-h-screen bg-nike-gray-50 py-12">
      <div className="container-nike max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-nike-gray-900 mb-8 text-center">
          Shipping Information
        </h1>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-nike-gray-900">
              Delivery Options & Times
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-4">
            <p>
              We offer several shipping options to meet your needs. Please note that delivery times are estimates and may vary based on your location and unforeseen circumstances.
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Shipping Method</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Estimated Delivery</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Standard Shipping</TableCell>
                  <TableCell>Our most economical option for reliable delivery.</TableCell>
                  <TableCell className="text-right">5-7 Business Days</TableCell>
                  <TableCell className="text-right">$5.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Express Shipping</TableCell>
                  <TableCell>Faster delivery for when you need your shoes sooner.</TableCell>
                  <TableCell className="text-right">2-3 Business Days</TableCell>
                  <TableCell className="text-right">$15.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Overnight Shipping</TableCell>
                  <TableCell>Our fastest option for next-day delivery.</TableCell>
                  <TableCell className="text-right">1 Business Day</TableCell>
                  <TableCell className="text-right">$25.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-nike-gray-900">
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-nike-gray-700 space-y-4">
            <p>
              Orders are typically processed within 1-2 business days. You will receive a confirmation email with tracking information once your order has shipped.
            </p>
            <p>
              Please ensure your shipping address is correct at checkout, as we cannot redirect orders once they have been dispatched.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
