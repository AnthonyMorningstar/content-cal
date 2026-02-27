// ============================================
// Settings Page
// ============================================
// User profile settings and preferences

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Bell, Palette } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import ThemeToggle from "@/components/layout/ThemeToggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update session (client-side)
      await updateSession({ name });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card padding="none">
        <form onSubmit={handleSaveProfile}>
          <div className="p-6">
            <CardHeader>
              <div>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5 text-brand-500" />
                    Profile
                  </span>
                </CardTitle>
                <CardDescription>
                  Your personal information
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar
                    src={session?.user?.image}
                    name={session?.user?.name}
                    size="xl"
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {session?.user?.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                {/* Name input */}
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />

                {/* Email (read-only) */}
                <Input
                  label="Email Address"
                  value={session?.user?.email || ""}
                  disabled
                  helperText="Email cannot be changed"
                />
              </div>
            </CardContent>
          </div>

          <CardFooter className="border-t border-slate-200 px-6 py-4 dark:border-surface-700">
            <Button
              type="submit"
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-brand-500" />
                Appearance
              </span>
            </CardTitle>
            <CardDescription>
              Choose your preferred theme
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <ThemeToggle variant="full" />
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand-500" />
                Notifications
              </span>
            </CardTitle>
            <CardDescription>
              Configure email notifications
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Notification settings coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}