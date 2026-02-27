// ============================================
// Dashboard Layout Shell
// ============================================
// Wraps all authenticated pages with:
// - Sidebar (desktop)
// - Mobile nav (mobile)
// - Top navbar
// - Main content area

"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar collapsed state (desktop)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mobile nav open state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMobileNavClose = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* ---- Desktop Sidebar (hidden on mobile) ---- */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* ---- Mobile Navigation Overlay ---- */}
      <MobileNav isOpen={mobileNavOpen} onClose={handleMobileNavClose} />

      {/* ---- Main Content Area ---- */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        {/* Top navbar */}
        <Navbar
          onMenuClick={() => setMobileNavOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 px-4 py-4 dark:border-surface-700">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} ContentCal. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Made with ❤️ for creators
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}