// ============================================
// User Billing Info API
// ============================================
// GET /api/user/billing
// Returns detailed billing info for the current user

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getMonthlyPostCount } from "@/lib/session";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const postsThisMonth = await getMonthlyPostCount(session.user.id);

    const isPro =
      subscription?.plan === "PRO" &&
      (!subscription.currentPeriodEnd ||
        new Date(subscription.currentPeriodEnd) > new Date());

    const billing = {
      plan: isPro ? "PRO" : "FREE",
      isActive: isPro,
      currentPeriodEnd: subscription?.currentPeriodEnd || null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
      postsUsedThisMonth: postsThisMonth,
      postsLimit: isPro ? Infinity : 10,
      canCreatePost: isPro || postsThisMonth < 10,
      hasStripe: !!subscription?.stripeSubscriptionId,
      hasPayPal: !!subscription?.paypalSubscriptionId,
    };

    return NextResponse.json({
      success: true,
      data: billing,
    });
  } catch (error) {
    console.error("GET /api/user/billing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch billing info" },
      { status: 500 }
    );
  }
}