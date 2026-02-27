// ============================================
// Dashboard Stats Hook
// ============================================
// Fetches real-time statistics from the API
// for the dashboard page

"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardStats } from "@/types";

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/stats");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stats");
      }

      setStats(data.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch stats";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}