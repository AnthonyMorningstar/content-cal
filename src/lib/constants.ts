// ============================================
// Application Constants
// ============================================

// Plan limits
export const PLAN_LIMITS = {
  FREE: {
    maxPostsPerMonth: 10,
    name: "Free",
    price: 0,
    features: [
      "Up to 10 posts per month",
      "Calendar view",
      "Kanban board view",
      "Basic status tracking",
    ],
  },
  PRO: {
    maxPostsPerMonth: Infinity,
    name: "Pro",
    price: 5,
    features: [
      "Unlimited posts",
      "All views (Calendar, Board, List)",
      "Full status tracking",
      "Historical data access",
      "Custom categories & colors",
      "Priority support",
    ],
  },
} as const;

// Status configuration
export const STATUS_CONFIG = {
  IDEA: {
    label: "Idea",
    color: "#F59E0B",
    bgClass: "status-idea",
    icon: "💡",
    order: 0,
  },
  WRITING: {
    label: "Writing",
    color: "#3B82F6",
    bgClass: "status-writing",
    icon: "✍️",
    order: 1,
  },
  EDITING: {
    label: "Editing",
    color: "#8B5CF6",
    bgClass: "status-editing",
    icon: "🔍",
    order: 2,
  },
  PUBLISHED: {
    label: "Published",
    color: "#10B981",
    bgClass: "status-published",
    icon: "🚀",
    order: 3,
  },
} as const;

// Content type configuration
export const CONTENT_TYPE_CONFIG = {
  BLOG_POST: {
    label: "Blog Post",
    icon: "📝",
    bgClass: "type-blog",
    color: "#6366F1",
  },
  YOUTUBE_VIDEO: {
    label: "YouTube Video",
    icon: "🎬",
    bgClass: "type-youtube",
    color: "#EF4444",
  },
  SOCIAL_MEDIA: {
    label: "Social Media",
    icon: "📱",
    bgClass: "type-social",
    color: "#EC4899",
  },
  PODCAST: {
    label: "Podcast",
    icon: "🎙️",
    bgClass: "type-podcast",
    color: "#F97316",
  },
  OTHER: {
    label: "Other",
    icon: "📋",
    bgClass: "type-blog",
    color: "#64748B",
  },
} as const;

// Navigation items for sidebar
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: "Calendar",
  },
  {
    label: "Board",
    href: "/board",
    icon: "Columns3",
  },
  {
    label: "All Posts",
    href: "/posts",
    icon: "FileText",
  },
] as const;

// Color palette for categories and posts
export const COLOR_PALETTE = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Slate", value: "#64748B" },
] as const;

// Days of the week
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// Months
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;