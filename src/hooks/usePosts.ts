// ============================================
// Posts Data Hook
// ============================================
// Custom hook for fetching, creating, updating,
// and deleting posts with loading/error states

"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { PostWithCategory, CreatePostInput, PostFilters } from "@/types";

export function usePosts(filters?: PostFilters) {
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Build query string from filters
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (filters?.status) params.set("status", filters.status);
    if (filters?.contentType) params.set("contentType", filters.contentType);
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.set("dateTo", filters.dateTo);

    return params.toString();
  }, [filters]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryString = buildQueryString();
      const url = `/api/posts${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      setPosts(data.data);
      setTotal(data.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch posts";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [buildQueryString]);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create post
  const createPost = async (input: CreatePostInput): Promise<PostWithCategory | null> => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create post");
        return null;
      }

      toast.success("Post created successfully!");
      await fetchPosts(); // Refresh list
      return data.data;
    } catch {
      toast.error("Failed to create post");
      return null;
    }
  };

  // Update post
  const updatePost = async (
    id: string,
    input: Partial<CreatePostInput>
  ): Promise<PostWithCategory | null> => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update post");
        return null;
      }

      toast.success("Post updated successfully!");
      await fetchPosts(); // Refresh list
      return data.data;
    } catch {
      toast.error("Failed to update post");
      return null;
    }
  };

  // Delete post
  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete post");
        return false;
      }

      toast.success("Post deleted successfully!");
      await fetchPosts(); // Refresh list
      return true;
    } catch {
      toast.error("Failed to delete post");
      return false;
    }
  };

  return {
    posts,
    isLoading,
    error,
    total,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}

// ---- Separate hook for categories ----
export function useCategories() {
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; color: string; _count: { posts: number } }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (response.ok) {
        setCategories(data.data);
      }
    } catch {
      console.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (name: string, color?: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create category");
        return null;
      }

      toast.success("Category created!");
      await fetchCategories();
      return data.data;
    } catch {
      toast.error("Failed to create category");
      return null;
    }
  };

  return { categories, isLoading, fetchCategories, createCategory };
}