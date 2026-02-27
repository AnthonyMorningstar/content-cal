/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// Single Post API — Read, Update, Delete
// ============================================
// GET    /api/posts/:id  → Get single post
// PUT    /api/posts/:id  → Update post
// DELETE /api/posts/:id  → Delete post

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// ---- Validation Schema ----
const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
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

// Helper: verify post belongs to user
async function getPostForUser(postId: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { category: true },
  });

  if (!post) return { error: "Post not found", status: 404 };
  if (post.userId !== userId) return { error: "Forbidden", status: 403 };

  return { post };
}

// ---- GET: Single Post ----
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const result = await getPostForUser(id, session.user.id);

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.post,
    });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// ---- PUT: Update Post ----
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const result = await getPostForUser(id, session.user.id);
    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = updatePostSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.issues.map((e: any) => e.message);
      return NextResponse.json(
        { success: false, error: errors[0] },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.contentType !== undefined) updateData.contentType = data.contentType;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;
    if (data.calendarOrder !== undefined) updateData.calendarOrder = data.calendarOrder;

    if (data.calendarDate !== undefined) {
      updateData.calendarDate = data.calendarDate
        ? new Date(data.calendarDate)
        : null;
    }

    // Update
    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// ---- DELETE: Delete Post ----
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const result = await getPostForUser(id, session.user.id);
    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    // Delete
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}