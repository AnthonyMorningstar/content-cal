// ============================================
// Posts API — List & Create
// ============================================
// GET  /api/posts  → List all posts (with filters)
// POST /api/posts  → Create a new post

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { canCreatePost } from "@/lib/session";
import { z } from "zod";

// ---- Validation Schema ----
const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000).optional().nullable(),
  status: z.enum(["IDEA", "WRITING", "EDITING", "PUBLISHED"]).optional(),
  contentType: z
    .enum(["BLOG_POST", "YOUTUBE_VIDEO", "SOCIAL_MEDIA", "PODCAST", "OTHER"])
    .optional(),
  calendarDate: z.string().optional().nullable(),
  calendarOrder: z.number().optional(),
  notes: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

// ---- GET: List Posts ----
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const contentType = searchParams.get("contentType");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (contentType) {
      where.contentType = contentType;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      where.calendarDate = {};
      if (dateFrom) {
        (where.calendarDate as Record<string, unknown>).gte = new Date(dateFrom);
      }
      if (dateTo) {
        (where.calendarDate as Record<string, unknown>).lte = new Date(dateTo);
      }
    }

    // Query posts with pagination
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          [sortField]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// ---- POST: Create Post ----
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check plan limits
    const allowed = await canCreatePost(session.user.id);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You've reached your monthly post limit. Upgrade to Pro for unlimited posts!",
        },
        { status: 403 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((e) => e.message);
      return NextResponse.json(
        { success: false, error: errors[0] },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create the post
    const post = await prisma.post.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: data.status || "IDEA",
        contentType: data.contentType || "BLOG_POST",
        calendarDate: data.calendarDate ? new Date(data.calendarDate) : null,
        calendarOrder: data.calendarOrder || 0,
        notes: data.notes || null,
        color: data.color || "#6366F1",
        categoryId: data.categoryId || null,
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { success: true, data: post },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}