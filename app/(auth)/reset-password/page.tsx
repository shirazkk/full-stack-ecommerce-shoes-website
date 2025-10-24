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
import { useToast } from '@/hooks/use-toast';
import { resetPassword, updatePassword } from '@/lib/auth/client';
import { Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const requestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

const updateSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isUpdateMode = searchParams.get('update') === 'true';

  const requestForm = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: '',
    },
  });

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onRequestSubmit(values: z.infer<typeof requestSchema>) {
    setIsLoading(true);
    const { error } = await resetPassword(values.email);

    if (error) {
      toast({
        title: 'Password Reset Failed',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
    }
    setIsLoading(false);
  }

  async function onUpdateSubmit(values: z.infer<typeof updateSchema>) {
    setIsLoading(true);
    const { error } = await updatePassword(values.password);

    if (error) {
      toast({
        title: 'Password Update Failed',
        description: error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Password Updated Successfully',
        description: 'Your password has been updated. You can now login with your new password.',
      });
      router.push('/auth/login');
    }
    setIsLoading(false);
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
          <CardTitle className="text-2xl text-white">
            {isUpdateMode ? 'Set New Password' : 'Reset Your Password'}
          </CardTitle>
          <CardDescription className="text-nike-gray-300">
            {isUpdateMode
              ? 'Enter your new password below.'
              : 'Enter your email address and we will send you a link to reset your password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isUpdateMode ? (
            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-white">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                  {...updateForm.register('password')}
                />
                {updateForm.formState.errors.password && (
                  <p className="text-sm text-red-400">{updateForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                  {...updateForm.register('confirmPassword')}
                />
                {updateForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-400">{updateForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-nike-orange-500 hover:bg-nike-orange-600" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          ) : (
            <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                  {...requestForm.register('email')}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-sm text-red-400">{requestForm.formState.errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-nike-orange-500 hover:bg-nike-orange-600" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-nike-gray-300">
              <Link href="/login" className="text-nike-orange-400 hover:text-nike-orange-300 underline">
                Back to Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}