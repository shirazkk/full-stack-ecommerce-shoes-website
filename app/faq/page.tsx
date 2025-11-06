import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept major credit cards (Visa, MasterCard, American Express) and Stripe.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping usually takes 5-7 business days. Express and overnight options are available for faster delivery.",
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes, we offer free returns and exchanges within 30 days of purchase, provided the items are unworn and in their original packaging.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the United States. We are working on expanding our shipping options soon!",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number and a link to monitor your package's journey.",
  },
  {
    question: "What if my order arrives damaged?",
    answer: "Please contact our customer support immediately with photos of the damaged item and packaging. We will arrange for a replacement or refund.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-nike-gray-50 py-12">
      <div className="container-nike max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-nike-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h1>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-nike-gray-900 text-left hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-nike-gray-700 text-base leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
