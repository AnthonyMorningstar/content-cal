// ============================================
// Dashboard Page — Real Stats
// ============================================
// Command center: stats, charts, recent posts,
// upcoming content, usage meter, quick actions

"use client";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCards from "@/components/dashboard/StatsCards";
import PipelineChart from "@/components/dashboard/PipelineChart";
import ContentTypeChart from "@/components/dashboard/ContentTypeChart";
import RecentPosts from "@/components/dashboard/RecentPosts";
import UpcomingPosts from "@/components/dashboard/UpcomingPosts";
import QuickActions from "@/components/dashboard/QuickActions";
import UsageMeter from "@/components/dashboard/UsageMeter";
import { SkeletonStats, SkeletonCard } from "@/components/ui/Skeleton";
import { useStats } from "@/hooks/useStats";
import { usePosts } from "@/hooks/usePosts";

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useStats();
  const { posts, isLoading: postsLoading } = usePosts();

  const isLoading = statsLoading || postsLoading;

  return (
    <div className="space-y-6">
      {/* ---- Welcome Banner ---- */}
      <WelcomeBanner />

      {/* ---- Stats Cards ---- */}
      {isLoading || !stats ? (
        <SkeletonStats />
      ) : (
        <StatsCards stats={stats} />
      )}

      {/* ---- Main Grid ---- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pipeline + Content Type Charts */}
          {isLoading || !stats ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <PipelineChart stats={stats} />
                <ContentTypeChart stats={stats} />
              </div>
            </>
          )}

          {/* Recent Posts */}
          {isLoading || !stats ? (
            <SkeletonCard />
          ) : (
            <RecentPosts posts={stats.recentPosts} />
          )}
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Usage Meter */}
          {isLoading || !stats ? (
            <SkeletonCard />
          ) : (
            <UsageMeter stats={stats} />
          )}

          {/* Upcoming Posts */}
          {postsLoading ? (
            <SkeletonCard />
          ) : (
            <UpcomingPosts posts={posts} />
          )}

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}