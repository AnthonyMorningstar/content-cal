// ============================================
// Register Page
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const allChecksPassed = Object.values(passwordChecks).every(Boolean);

  // Handle registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!allChecksPassed) {
      setError("Please meet all password requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      // Redirect to login with success message
      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ---- Mobile Logo ---- */}
      <div className="text-center lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            ContentCal
          </span>
        </Link>
      </div>

      {/* ---- Header ---- */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create your account
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Start planning your content for free
        </p>
      </div>

      {/* ---- Error Message ---- */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ---- Registration Form ---- */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              minLength={2}
              maxLength={50}
              disabled={isLoading}
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="input-field pl-11"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              disabled={isLoading}
              className="input-field pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password strength indicators */}
          {password.length > 0 && (
            <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-800">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Password requirements:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "uppercase", label: "Uppercase letter" },
                  { key: "lowercase", label: "Lowercase letter" },
                  { key: "number", label: "Number" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                        passwordChecks[key as keyof typeof passwordChecks]
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 dark:bg-surface-600"
                      }`}
                    >
                      {passwordChecks[key as keyof typeof passwordChecks] && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        passwordChecks[key as keyof typeof passwordChecks]
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !allChecksPassed}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-surface-900"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          By creating an account, you agree to our{" "}
          <Link
            href="#"
            className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
          >
            Privacy Policy
          </Link>
        </p>
      </form>

      {/* ---- Footer ---- */}
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}