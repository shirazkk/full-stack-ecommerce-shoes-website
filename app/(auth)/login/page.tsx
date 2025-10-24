'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn, signInWithOAuth } from '@/lib/auth/client';
import { Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { user, error } = await signIn(values);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error,
        variant: 'destructive',
      });
    } else if (user) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      const redirectTo = searchParams.get('redirectTo') || '/';
      router.push(redirectTo);
    }
    setIsLoading(false);
  }

  async function handleGoogleSignIn() {
    setIsOAuthLoading(true);
    const { error } = await signInWithOAuth('google');
    if (error) {
      toast({
        title: 'Google Login Failed',
        description: error,
        variant: 'destructive',
      });
    }
    setIsOAuthLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="space-y-1 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="w-12 h-12 bg-nike-orange-500 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </motion.div>
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
          <CardDescription className="text-nike-gray-300">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-nike-orange-500 hover:bg-nike-orange-600" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-nike-black px-2 text-nike-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" 
            onClick={handleGoogleSignIn} 
            disabled={isOAuthLoading}
          >
            {isOAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Google
          </Button>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-nike-gray-300">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-nike-orange-400 hover:text-nike-orange-300 underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-nike-gray-300">
              <Link href="/auth/reset-password" className="text-nike-orange-400 hover:text-nike-orange-300 underline">
                Forgot password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}