// ============================================
// TypeScript Type Definitions
// ============================================

import { Post, Category, Subscription, User } from "@prisma/client";

// ============================================
// Extended Models (with relations)
// ============================================

export type PostWithCategory = Post & {
  category: Category | null;
};

export type PostWithUser = Post & {
  user: Pick<User, "id" | "name" | "email" | "image">;
  category: Category | null;
};

export type UserWithSubscription = User & {
  subscription: Subscription | null;
};

// ============================================
// API Request Types
// ============================================

export interface CreatePostInput {
  title: string;
  description?: string;
  status?: "IDEA" | "WRITING" | "EDITING" | "PUBLISHED";
  contentType?: "BLOG_POST" | "YOUTUBE_VIDEO" | "SOCIAL_MEDIA" | "PODCAST" | "OTHER";
  calendarDate?: string | null;
  calendarOrder?: number;
  notes?: string;
  color?: string;
  categoryId?: string | null;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export interface ReorderPostInput {
  postId: string;
  calendarDate: string | null;
  calendarOrder: number;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  totalPosts: number;
  postsThisMonth: number;
  postsByStatus: {
    IDEA: number;
    WRITING: number;
    EDITING: number;
    PUBLISHED: number;
  };
  postsByType: {
    BLOG_POST: number;
    YOUTUBE_VIDEO: number;
    SOCIAL_MEDIA: number;
    PODCAST: number;
    OTHER: number;
  };
  recentPosts: PostWithCategory[];
  monthlyLimit: number;
  isProUser: boolean;
}

// ============================================
// Calendar Types
// ============================================

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: PostWithCategory[];
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-indexed
  days: CalendarDay[];
}

// ============================================
// Kanban Board Types
// ============================================

export type KanbanColumn = {
  id: "IDEA" | "WRITING" | "EDITING" | "PUBLISHED";
  title: string;
  icon: string;
  color: string;
  posts: PostWithCategory[];
};

// ============================================
// Filter & Sort Types
// ============================================

export interface PostFilters {
  status?: string;
  contentType?: string;
  categoryId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type SortField = "title" | "createdAt" | "updatedAt" | "calendarDate" | "status";
export type SortOrder = "asc" | "desc";

export interface PostSort {
  field: SortField;
  order: SortOrder;
}

// ============================================
// Subscription / Billing Types
// ============================================

export interface BillingInfo {
  plan: "FREE" | "PRO";
  isActive: boolean;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  postsUsedThisMonth: number;
  postsLimit: number;
  canCreatePost: boolean;
}

export type PaymentProvider = "stripe" | "paypal";

export interface CheckoutSessionInput {
  priceId: string;
  provider: PaymentProvider;
}