"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signUp, signInWithOAuth } from "@/lib/auth/client";
import { Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    phone: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val.trim() === "") return true; // Optional field
        return /^\+?[\d\s\-\(\)]+$/.test(val) && val.replace(/\D/g, "").length >= 10;
      }, "Please enter a valid phone number (at least 10 digits)"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { user, error } = await signUp({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      phone: values.phone || undefined,
    });

    if (error) {
      toast({
        title: "Signup Failed",
        description: error,
        variant: "destructive",
      });
    } else if (user) {
      toast({
        title: "Signup Successful",
        description: "Please check your email to verify your account.",
      });
      router.push("/login");
    }
    setIsLoading(false);
  }

  async function handleGoogleSignIn() {
    setIsOAuthLoading(true);
    const { error } = await signInWithOAuth("google");
    if (error) {
      toast({
        title: "Google Signup Failed",
        description: error,
        variant: "destructive",
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
          <CardTitle className="text-2xl text-white">Join the Game</CardTitle>
          <CardDescription className="text-nike-gray-300">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-white">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-white">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-white/10 border-white/20 text-white placeholder:text-nike-gray-400"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-nike-orange-500 hover:bg-nike-orange-600"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-nike-black px-2 text-nike-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={handleGoogleSignIn}
            disabled={isOAuthLoading}
          >
            {isOAuthLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue with Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-nike-gray-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-nike-orange-400 hover:text-nike-orange-300 underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
