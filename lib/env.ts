import { z } from 'zod';

// Environment variable validation schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SERVICE_KEY: z.string().min(1, 'Supabase service role key is required'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),
  
  // Optional environment variables
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(
        `Missing or invalid environment variables:\n${missingVars.join('\n')}\n\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      );
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Helper functions for common environment checks
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Supabase configuration
export const supabaseConfig = {
  url: env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: env.SERVICE_KEY,
} as const;

// Stripe configuration
export const stripeConfig = {
  secretKey: env.STRIPE_SECRET_KEY,
  publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  webhookSecret: env.STRIPE_WEBHOOK_SECRET,
} as const;

// App configuration
export const appConfig = {
  url: env.NEXT_PUBLIC_APP_URL,
  isDevelopment,
  isProduction,
  isTest,
} as const;
