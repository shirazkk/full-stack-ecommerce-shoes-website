// 'use client'
// import { motion } from "framer-motion";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { CreditCard, Lock, Shield } from "lucide-react";
// import { CheckoutFormData } from "@/lib/validations/checkout";

// interface PaymentInfoProps {
//   form: CheckoutFormData;
//   onInputChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
// }

// export default function PaymentInfo({
//   form,
//   onInputChange,
// }: PaymentInfoProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <CreditCard className="h-5 w-5 mr-2 text-nike-orange-500" />
//             Payment Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="p-6 border-2 border-dashed border-nike-gray-300 rounded-lg text-center">
//             <Lock className="h-8 w-8 text-nike-gray-400 mx-auto mb-4" />
//             <h3 className="font-semibold text-nike-gray-900 mb-2">
//               Secure Payment
//             </h3>
//             <p className="text-sm text-nike-gray-600 mb-4">
//               Your payment information is encrypted and secure. We use
//               Stripe for secure payment processing.
//             </p>
//             <div className="flex items-center justify-center space-x-4 text-sm text-nike-gray-500">
//               <Shield className="h-4 w-4" />
//               <span>SSL Encrypted</span>
//               <span>•</span>
//               <span>PCI Compliant</span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="newsletter"
//               checked={form.newsletter}
//               onCheckedChange={(checked) =>
//                 onInputChange("newsletter", checked as boolean)
//               }
//             />
//             <Label htmlFor="newsletter">
//               Subscribe to our newsletter for updates and exclusive
//               offers
//             </Label>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

