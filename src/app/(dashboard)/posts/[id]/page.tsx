// ============================================
// Edit Post Page
// ============================================
// Fetches the existing post and renders the form
// in edit mode

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PostForm from "@/components/posts/PostForm";
import { SkeletonCard } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { FileText, ArrowLeft } from "lucide-react";
import type { PostWithCategory } from "@/types";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<PostWithCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Post not found");
          return;
        }

        setPost(data.data);
      } catch {
        setError("Failed to load post");
      } finally {
        setIsLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <SkeletonCard className="h-12 w-20" />
          <SkeletonCard className="h-12 flex-1" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SkeletonCard />
          </div>
          <div>
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <EmptyState
        icon={<FileText className="h-8 w-8" />}
        title="Post not found"
        description={error || "This post doesn't exist or you don't have access to it."}
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/posts")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Posts
          </Button>
        }
      />
    );
  }

  return <PostForm post={post} mode="edit" />;
}