// ============================================
// Server-Side Session Helper
// ============================================
// Use this in Server Components and API routes
// to get the current authenticated user

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Get the current session (server-side)
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current authenticated user with subscription info
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
    },
  });

  return user;
}

/**
 * Check if the current user has a Pro subscription
 */
export async function isProUser(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user?.subscription) return false;

  const { plan, currentPeriodEnd } = user.subscription;

  if (plan !== "PRO") return false;

  // Check if subscription hasn't expired
  if (currentPeriodEnd && new Date(currentPeriodEnd) < new Date()) {
    return false;
  }

  return true;
}

/**
 * Get how many posts the user has created this month
 */
export async function getMonthlyPostCount(userId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const count = await prisma.post.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  return count;
}

/**
 * Check if user can create a new post (respecting plan limits)
 */
export async function canCreatePost(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) return false;

  // Pro users have unlimited posts
  const isPro = user.subscription?.plan === "PRO" &&
    (!user.subscription.currentPeriodEnd ||
      new Date(user.subscription.currentPeriodEnd) > new Date());

  if (isPro) return true;

  // Free users: check monthly limit
  const monthlyCount = await getMonthlyPostCount(userId);
  return monthlyCount < 10;
}