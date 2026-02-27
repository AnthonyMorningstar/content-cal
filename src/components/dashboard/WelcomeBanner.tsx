// ============================================
// Welcome Banner Component
// ============================================
// Personalized greeting with user name and
// a motivational call-to-action

"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Calendar, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function WelcomeBanner() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Creator";

  // Time-based greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  let emoji = "☀️";

  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
    emoji = "🌤️";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good evening";
    emoji = "🌅";
  } else if (hour >= 21 || hour < 5) {
    greeting = "Good night";
    emoji = "🌙";
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 p-6 text-white shadow-xl shadow-brand-500/10 sm:p-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative">
        {/* Greeting */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-xl font-bold sm:text-2xl">
            {greeting}, {firstName}!
          </h2>
        </div>

        <p className="mt-2 max-w-md text-sm text-brand-100 sm:text-base">
          Ready to plan some amazing content? Your calendar awaits.
        </p>

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/posts/new">
            <Button
              variant="secondary"
              className="bg-white text-brand-700 hover:bg-brand-50 dark:bg-white dark:text-brand-700 dark:hover:bg-brand-50"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Post
            </Button>
          </Link>
          <Link href="/calendar">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10"
              leftIcon={<Calendar className="h-4 w-4" />}
            >
              Open Calendar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}