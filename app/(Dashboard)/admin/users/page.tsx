"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Shield,
  Clock,
  Search,
  X,
  Package,
  MapPin,
} from "lucide-react";
import { AuthUser } from "@/lib/auth/server";
import Image from "next/image";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nike-gray-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-nike-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nike-gray-50 relative">
      <div className="container-nike py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-nike-gray-900">Users</h1>
            <p className="text-nike-gray-600">Manage all registered users</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-nike-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.length === 0 && (
            <p className="text-center text-nike-gray-500 col-span-full">
              No users found.
            </p>
          )}
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="shadow-md hover:shadow-lg transition">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className=" flex items-center justify-center rounded-full">
                      {user.avatar_url && user.avatar_url !== "" ? (
                        <Image
                          src={user.avatar_url}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className=" h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-nike-orange-500 text-white flex items-center justify-center rounded-full font-semibold">
                          {user.full_name?.[0] || user.email[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user.full_name || "Unnamed User"}
                      </CardTitle>
                      <p className="text-sm text-nike-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {user.role === "admin" ? (
                    <Badge className="bg-purple-100 text-purple-800 flex items-center">
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 flex items-center">
                      <User className="h-3 w-3 mr-1" /> User
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="text-sm text-nike-gray-600 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-nike-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-nike-gray-400" />
                    <span>
                      Joined{" "}
                      {new Date(user.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3 text-sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-white w-full sm:w-[450px] h-full shadow-xl overflow-y-auto p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedUser.full_name || "User Details"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4 text-sm text-nike-gray-700">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-nike-gray-400" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-nike-gray-400" />
                  <span>
                    Joined{" "}
                    {new Date(
                      selectedUser.created_at || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-nike-gray-400" />
                  <span>Role: {selectedUser.role}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-nike-gray-400" />
                  <span>Orders: {selectedUser.order_count || 0}</span>
                </div>

                {selectedUser.address && (
                  <div className="pt-4 border-t">
                    <p className="font-semibold flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-nike-orange-500" />
                      Address
                    </p>
                    <p>{selectedUser.address.address_line1}</p>
                    {selectedUser.address.address_line2 && (
                      <p>{selectedUser.address.address_line2}</p>
                    )}
                    <p>
                      {selectedUser.address.city}, {selectedUser.address.state}{" "}
                      {selectedUser.address.postal_code}
                    </p>
                    <p>{selectedUser.address.country}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
