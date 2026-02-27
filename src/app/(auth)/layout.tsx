// ============================================
// Auth Pages Layout
// ============================================
// Shared layout for login and register pages
// Centered card with branding

import { Calendar } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* ---- Left Panel: Branding (hidden on mobile) ---- */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 p-12 text-white">
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">ContentCal</span>
          </Link>
        </div>

        {/* Testimonial / Feature highlight */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold leading-tight">
              Plan your content.
              <br />
              Grow your audience.
            </h2>
            <p className="text-lg text-white/80">
              The drag-and-drop content calendar that helps creators stay
              consistent and organized.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {[
              "📅 Calendar View",
              "📋 Kanban Board",
              "🎯 Status Tracking",
              "🚀 Drag & Drop",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {[
                "bg-amber-400",
                "bg-emerald-400",
                "bg-blue-400",
                "bg-pink-400",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full border-2 border-white/30 ${color}`}
                />
              ))}
            </div>
            <p className="text-sm text-white/70">
              Join 1,000+ creators who plan smarter
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} ContentCal. All rights reserved.
        </p>
      </div>

      {/* ---- Right Panel: Auth Form ---- */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 bg-surface-50 dark:bg-surface-900">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}