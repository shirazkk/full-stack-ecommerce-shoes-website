'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Package, Heart, Settings, LogOut, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, signOut } from '@/lib/auth/client';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      } else {
        router.push('/login?redirectTo=/account');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      router.push('/login?redirectTo=/account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to sign out. Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signed Out',
          description: 'You have been signed out successfully.',
        });
        router.push('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.full_name || 'No name set'}</h3>
                <p className="text-gray-600">{user.email}</p>
                <Badge variant="outline" className="mt-1">
                  {user.role === 'admin' ? 'Administrator' : 'Customer'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="h-8 w-8 text-blue-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Order History</h3>
              <p className="text-gray-600 text-sm mb-4">
                View and track your recent orders
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/orders">
                  View Orders
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Wishlist */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Heart className="h-8 w-8 text-red-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wishlist</h3>
              <p className="text-gray-600 text-sm mb-4">
                Items you've saved for later
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/wishlist">
                  View Wishlist
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Settings className="h-8 w-8 text-gray-600" />
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
              <p className="text-gray-600 text-sm mb-4">
                Update your profile and preferences
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/settings">
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sign Out</h3>
                <p className="text-gray-600 text-sm">Sign out of your account</p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
