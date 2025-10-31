'use client'
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck } from "lucide-react";
import { CheckoutFormData } from "@/lib/validations/checkout";

interface ShippingInfoProps {
  form: CheckoutFormData;
  formErrors: Record<string, string[]>;
  onInputChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
}

export default function ShippingInfo({
  form,
  formErrors,
  onInputChange,
}: ShippingInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2 text-nike-orange-500" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                placeholder="you@email.com"
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.email[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.phone[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => onInputChange("firstName", e.target.value)}
                placeholder="John"
                className={formErrors.firstName ? "border-red-500" : ""}
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.firstName[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => onInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className={formErrors.lastName ? "border-red-500" : ""}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.lastName[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="123 Main Street"
              className={formErrors.address ? "border-red-500" : ""}
            />
            {formErrors.address && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.address[0]}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address2">Address Line 2</Label>
            <Input
              id="address2"
              value={(form as any).address2 ?? ""}
              onChange={(e) =>
                onInputChange("address2" as any, e.target.value)
              }
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => onInputChange("city", e.target.value)}
                placeholder="New York"
                className={formErrors.city ? "border-red-500" : ""}
              />
              {formErrors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.city[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => onInputChange("state", e.target.value)}
                placeholder="NY"
                className={formErrors.state ? "border-red-500" : ""}
              />
              {formErrors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.state[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={form.zipCode}
                onChange={(e) => onInputChange("zipCode", e.target.value)}
                placeholder="10001"
                className={formErrors.zipCode ? "border-red-500" : ""}
              />
              {formErrors.zipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.zipCode[0]}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveInfo"
              checked={form.saveInfo}
              onCheckedChange={(checked) =>
                onInputChange("saveInfo", checked as boolean)
              }
            />
            <Label htmlFor="saveInfo">
              Save this information for next time
            </Label>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}