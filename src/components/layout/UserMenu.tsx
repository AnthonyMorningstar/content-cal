// ============================================
// User Dropdown Menu
// ============================================
// Shows user avatar + dropdown with profile,
// settings, billing, and sign out options

"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  Crown,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!session?.user) return null;

  const user = session.user;
  const initials = getInitials(user.name);

  const menuItems = [
    {
      label: "Profile",
      href: "/settings",
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      label: "Billing",
      href: "/settings/billing",
      icon: CreditCard,
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* ---- Trigger Button ---- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg p-1.5 transition-all",
          "hover:bg-slate-100 dark:hover:bg-surface-700",
          isOpen && "bg-slate-100 dark:bg-surface-700"
        )}
      >
        {/* Avatar */}
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/40">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-700 dark:text-brand-300">
              {initials}
            </div>
          )}
        </div>

        {/* Name (hidden on small screens) */}
        <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 md:block">
          {user.name?.split(" ")[0]}
        </span>

        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-slate-400 transition-transform md:block",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* ---- Dropdown Menu ---- */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-scale-in rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-surface-600 dark:bg-surface-800">
          {/* User info header */}
          <div className="mb-2 border-b border-slate-100 px-3 pb-3 pt-2 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/40">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-brand-700 dark:text-brand-300">
                    {initials}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Plan badge */}
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-surface-700 dark:text-slate-300">
                Free Plan
              </span>
              <Link
                href="/settings/billing"
                onClick={() => setIsOpen(false)}
                className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                <Crown className="h-3 w-3" />
                Upgrade to Pro
              </Link>
            </div>
          </div>

          {/* Menu items */}
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-surface-700 dark:hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="mt-2 border-t border-slate-100 pt-2 dark:border-surface-700">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}