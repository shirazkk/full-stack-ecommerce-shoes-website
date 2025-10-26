import { z } from 'zod';

export const checkoutFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address must be less than 100 characters'),
  
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'City can only contain letters and spaces'),
  
  state: z
    .string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'State can only contain letters and spaces'),
  
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (12345 or 12345-6789)'),
  
  country: z
    .string()
    .min(1, 'Country is required')
    .length(2, 'Country must be a 2-letter code'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  
  shippingMethod: z
    .enum(['standard', 'express', 'overnight'], {
      errorMap: () => ({ message: 'Please select a valid shipping method' })
    }),
  
  paymentMethod: z
    .enum(['card', 'paypal', 'apple_pay', 'google_pay'], {
      errorMap: () => ({ message: 'Please select a valid payment method' })
    }),
  
  saveInfo: z.boolean(),
  newsletter: z.boolean(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Validation helper functions
export const validateCheckoutForm = (data: unknown) => {
  try {
    return {
      success: true,
      data: checkoutFormSchema.parse(data),
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.flatten().fieldErrors,
      };
    }
    return {
      success: false,
      data: null,
      errors: { general: ['An unexpected error occurred'] },
    };
  }
};

// Sanitization helper
export const sanitizeCheckoutForm = (data: CheckoutFormData): CheckoutFormData => {
  return {
    email: data.email.trim().toLowerCase(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    address: data.address.trim(),
    city: data.city.trim(),
    state: data.state.trim(),
    zipCode: data.zipCode.trim(),
    country: data.country.trim().toUpperCase(),
    phone: data.phone.replace(/\D/g, ''), // Remove non-digits
    shippingMethod: data.shippingMethod,
    paymentMethod: data.paymentMethod,
    saveInfo: data.saveInfo,
    newsletter: data.newsletter,
  };
};
