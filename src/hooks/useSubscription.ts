// ============================================
// Subscription Hook
// ============================================
// Handles billing actions: checkout, portal,
// PayPal subscription creation

"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { BillingInfo } from "@/types";

export function useSubscription() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current billing info
  const fetchBilling = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/stats");
      const data = await response.json();

      if (response.ok && data.data) {
        const stats = data.data;
        setBilling({
          plan: stats.isProUser ? "PRO" : "FREE",
          isActive: stats.isProUser,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          postsUsedThisMonth: stats.postsThisMonth,
          postsLimit: stats.monthlyLimit,
          canCreatePost: stats.isProUser || stats.postsThisMonth < 10,
        });
      }
    } catch {
      console.error("Failed to fetch billing info");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  // ---- Stripe Checkout ----
  const startStripeCheckout = async () => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to start checkout");
        return;
      }

      // Redirect to Stripe Checkout
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch {
      toast.error("Failed to start checkout");
    }
  };

  // ---- Stripe Customer Portal ----
  const openStripePortal = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to open billing portal");
        return;
      }

      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch {
      toast.error("Failed to open billing portal");
    }
  };

  // ---- PayPal Checkout ----
  const startPayPalCheckout = async () => {
    try {
      const response = await fetch("/api/paypal/create", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to start PayPal checkout");
        return;
      }

      // Redirect to PayPal approval
      if (data.data?.approvalUrl) {
        window.location.href = data.data.approvalUrl;
      }
    } catch {
      toast.error("Failed to start PayPal checkout");
    }
  };

  return {
    billing,
    isLoading,
    refetch: fetchBilling,
    startStripeCheckout,
    openStripePortal,
    startPayPalCheckout,
  };
}