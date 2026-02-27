// ============================================
// User Stats API
// ============================================
// GET /api/user/stats → Dashboard statistics

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

    const userId = session.user.id;

    // Get subscription info
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    const isPro = subscription?.plan === "PRO" &&
      (!subscription.currentPeriodEnd ||
        new Date(subscription.currentPeriodEnd) > new Date());

    // Run all queries in parallel
    const [
      totalPosts,
      postsThisMonth,
      ideaCount,
      writingCount,
      editingCount,
      publishedCount,
      blogCount,
      youtubeCount,
      socialCount,
      podcastCount,
      otherCount,
      recentPosts,
    ] = await Promise.all([
      // Total posts
      prisma.post.count({ where: { userId } }),

      // Posts this month
      getMonthlyPostCount(userId),

      // Posts by status
      prisma.post.count({ where: { userId, status: "IDEA" } }),
      prisma.post.count({ where: { userId, status: "WRITING" } }),
      prisma.post.count({ where: { userId, status: "EDITING" } }),
      prisma.post.count({ where: { userId, status: "PUBLISHED" } }),

      // Posts by content type
      prisma.post.count({ where: { userId, contentType: "BLOG_POST" } }),
      prisma.post.count({ where: { userId, contentType: "YOUTUBE_VIDEO" } }),
      prisma.post.count({ where: { userId, contentType: "SOCIAL_MEDIA" } }),
      prisma.post.count({ where: { userId, contentType: "PODCAST" } }),
      prisma.post.count({ where: { userId, contentType: "OTHER" } }),

      // Recent posts
      prisma.post.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

    const stats = {
      totalPosts,
      postsThisMonth,
      postsByStatus: {
        IDEA: ideaCount,
        WRITING: writingCount,
        EDITING: editingCount,
        PUBLISHED: publishedCount,
      },
      postsByType: {
        BLOG_POST: blogCount,
        YOUTUBE_VIDEO: youtubeCount,
        SOCIAL_MEDIA: socialCount,
        PODCAST: podcastCount,
        OTHER: otherCount,
      },
      recentPosts,
      monthlyLimit: isPro ? Infinity : 10,
      isProUser: isPro,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("GET /api/user/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}