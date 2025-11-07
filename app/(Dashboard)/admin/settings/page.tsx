"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { StoreSettings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    id: "",
    store_name: "",
    description: "",
    email: "",
    contact: "",
    address: { city: "", country: "" },
    logo_url: "",
    theme_color: "#3b82f6",
    currency: "USD",
    tax_rate: 0,
    free_shipping_threshold: 0,
    allow_admin_signup: true,
    maintenance_mode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");

      if (!response.ok) throw new Error("Failed to fetch settings");

      const data = await response.json();
      setSettings(data);
      setLogoPreview(data.logo_url);
    } catch (error) {
      setAlert({ type: "error", message: "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: "city" | "country", value: string) => {
    setSettings((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSettings((prev) => ({ ...prev, logo_url: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setAlert(null);

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      setAlert({ type: "success", message: "Settings saved successfully!" });

      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your store configuration and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.type === "error" ? "destructive" : "default"}>
          {alert.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic details about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store_name">Store Name</Label>
              <Input
                id="store_name"
                value={settings.store_name}
                onChange={(e) =>
                  handleInputChange("store_name", e.target.value)
                }
                placeholder="My Awesome Store"
              />
              <p className="text-xs text-gray-500">
                Displayed across your storefront
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Store Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="store@example.com"
              />
              <p className="text-xs text-gray-500">
                Used for customer communications and invoices
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tell customers about your store..."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              A brief overview of your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={settings.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-gray-500">
                Customer support phone number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={settings.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="New York"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={settings.address.country}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              placeholder="United States"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
          <CardDescription>
            Customize your store's visual identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Store Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 2MB. Recommended: 200x200px
                </p>
              </div>
              {logoPreview && (
                <div className="w-20 h-20 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme_color">Theme Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="theme_color"
                type="color"
                value={settings.theme_color}
                onChange={(e) =>
                  handleInputChange("theme_color", e.target.value)
                }
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={settings.theme_color}
                onChange={(e) =>
                  handleInputChange("theme_color", e.target.value)
                }
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Primary brand color used in buttons and accents
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
          <CardDescription>
            Configure pricing and shipping rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(val) => handleInputChange("currency", val)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Default store currency</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.01"
                value={settings.tax_rate}
                onChange={(e) =>
                  handleInputChange("tax_rate", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">Applied to all orders</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping_threshold">
                Free Shipping Threshold
              </Label>
              <Input
                id="shipping_threshold"
                type="number"
                step="0.01"
                value={settings.free_shipping_threshold}
                onChange={(e) =>
                  handleInputChange(
                    "free_shipping_threshold",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">
                Orders above this amount ship free
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Access</CardTitle>
          <CardDescription>
            Control access and maintenance settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow_signup">Allow Admin Signups</Label>
              <p className="text-sm text-gray-500">
                Enable new administrators to create accounts
              </p>
            </div>
            <Switch
              id="allow_signup"
              checked={settings.allow_admin_signup}
              onCheckedChange={(checked) =>
                handleInputChange("allow_admin_signup", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-sm text-gray-500">
                Display maintenance page to visitors
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) =>
                handleInputChange("maintenance_mode", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
