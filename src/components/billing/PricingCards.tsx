// ============================================
// Pricing Cards Component
// ============================================
// Side-by-side Free vs Pro plan comparison
// with Stripe and PayPal payment buttons

"use client";

import { useState } from "react";
import {
  Check,
  Crown,
  Sparkles,
  CreditCard,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PLAN_LIMITS } from "@/lib/constants";

interface PricingCardsProps {
  currentPlan: "FREE" | "PRO";
  onStripeCheckout: () => Promise<void>;
  onPayPalCheckout: () => Promise<void>;
  onManageBilling: () => Promise<void>;
}

export default function PricingCards({
  currentPlan,
  onStripeCheckout,
  onPayPalCheckout,
  onManageBilling,
}: PricingCardsProps) {
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const handleStripe = async () => {
    setIsStripeLoading(true);
    try {
      await onStripeCheckout();
    } finally {
      setIsStripeLoading(false);
    }
  };

  const handlePayPal = async () => {
    setIsPayPalLoading(true);
    try {
      await onPayPalCheckout();
    } finally {
      setIsPayPalLoading(false);
    }
  };

  const handlePortal = async () => {
    setIsPortalLoading(true);
    try {
      await onManageBilling();
    } finally {
      setIsPortalLoading(false);
    }
  };

  const anyLoading = isStripeLoading || isPayPalLoading || isPortalLoading;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* ---- Free Plan ---- */}
      <div
        className={cn(
          "relative rounded-2xl border-2 p-6 transition-all",
          currentPlan === "FREE"
            ? "border-slate-300 dark:border-surface-600"
            : "border-slate-200 dark:border-surface-700"
        )}
      >
        {currentPlan === "FREE" && (
          <div className="absolute -top-3 left-6">
            <span className="rounded-full bg-slate-600 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-500">
              Current Plan
            </span>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Free
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Perfect for getting started
          </p>

          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              $0
            </span>
            <span className="ml-1 text-slate-500 dark:text-slate-400">
              /month
            </span>
          </div>
        </div>

        <ul className="mb-6 space-y-3">
          {PLAN_LIMITS.FREE.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          fullWidth
          disabled
          className={currentPlan === "FREE" ? "" : "opacity-50"}
        >
          {currentPlan === "FREE" ? "Current Plan" : "Downgrade"}
        </Button>
      </div>

      {/* ---- Pro Plan ---- */}
      <div
        className={cn(
          "relative rounded-2xl border-2 p-6 transition-all",
          currentPlan === "PRO"
            ? "border-brand-500 bg-brand-50/30 dark:border-brand-500 dark:bg-brand-900/10"
            : "border-brand-400 dark:border-brand-500"
        )}
      >
        {/* Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-brand-500/20">
            <Sparkles className="h-3 w-3" />
            {currentPlan === "PRO" ? "Active" : "Recommended"}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Crown className="h-5 w-5 text-amber-500" />
            Pro
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            For serious content creators
          </p>

          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              $5
            </span>
            <span className="ml-1 text-slate-500 dark:text-slate-400">
              /month
            </span>
          </div>
        </div>

        <ul className="mb-6 space-y-3">
          {PLAN_LIMITS.PRO.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {feature}
            </li>
          ))}
        </ul>

        {/* Payment buttons */}
        {currentPlan === "PRO" ? (
          <Button
            variant="outline"
            fullWidth
            onClick={handlePortal}
            isLoading={isPortalLoading}
            loadingText="Opening portal..."
            leftIcon={<CreditCard className="h-4 w-4" />}
          >
            Manage Subscription
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Stripe (Card) */}
            <Button
              fullWidth
              onClick={handleStripe}
              disabled={anyLoading}
              leftIcon={
                isStripeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )
              }
            >
              {isStripeLoading ? "Redirecting..." : "Pay with Card"}
            </Button>

            {/* PayPal */}
            <Button
              variant="outline"
              fullWidth
              onClick={handlePayPal}
              disabled={anyLoading}
              leftIcon={
                isPayPalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.65h6.058c2.01 0 3.63.503 4.685 1.455 1.1 1.001 1.503 2.467 1.196 4.378-.018.115-.04.232-.063.35a6.82 6.82 0 0 1-.265 1.033c-.776 2.293-2.75 3.682-5.58 3.682H9.396a.77.77 0 0 0-.758.65l-.862 5.47a.641.641 0 0 1-.633.54l-.067-.291z" />
                    <path d="M19.93 7.87c-.018.115-.04.232-.063.35-.776 2.293-2.75 3.682-5.58 3.682h-2.336a.77.77 0 0 0-.758.65l-1.29 8.18a.49.49 0 0 0 .484.568h3.394a.67.67 0 0 0 .661-.567l.027-.14.523-3.32.034-.183a.67.67 0 0 1 .661-.567h.416c2.695 0 4.806-1.095 5.422-4.263.258-1.322.124-2.426-.557-3.2a2.72 2.72 0 0 0-.78-.583c-.024.132-.048.263-.075.393h-.183z" />
                  </svg>
                )
              }
            >
              {isPayPalLoading ? "Redirecting..." : "Pay with PayPal"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}