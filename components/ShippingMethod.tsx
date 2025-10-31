"use client";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutFormData } from "@/lib/validations/checkout";

interface ShippingMethodProps {
  form: CheckoutFormData;
  onInputChange: (
    field: keyof CheckoutFormData,
    value: string | boolean
  ) => void;
}

export default function ShippingMethod({
  form,
  onInputChange,
}: ShippingMethodProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={form.shippingMethod}
            onValueChange={(value) => onInputChange("shippingMethod", value)}
          >
            <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="standard" id="standard" />
                <div>
                  <Label htmlFor="standard" className="font-semibold">
                    Standard Shipping
                  </Label>
                  <p className="text-sm text-nike-gray-600">
                    5-7 business days
                  </p>
                </div>
              </div>
              <span className="font-semibold">FREE</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="express" id="express" />
                <div>
                  <Label htmlFor="express" className="font-semibold">
                    Express Shipping
                  </Label>
                  <p className="text-sm text-nike-gray-600">
                    2-3 business days
                  </p>
                </div>
              </div>
              <span className="font-semibold">$15.00</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="overnight" id="overnight" />
                <div>
                  <Label htmlFor="overnight" className="font-semibold">
                    Overnight Shipping
                  </Label>
                  <p className="text-sm text-nike-gray-600">
                    Next business day
                  </p>
                </div>
              </div>
              <span className="font-semibold">$25.00</span>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
}
