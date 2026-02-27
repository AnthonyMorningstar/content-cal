// ============================================
// Posts Reorder API
// ============================================
// PUT /api/posts/reorder
// Updates calendar date and order for drag-and-drop

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reorderSchema = z.object({
  postId: z.string(),
  calendarDate: z.string().nullable(),
  calendarOrder: z.number(),
  status: z.enum(["IDEA", "WRITING", "EDITING", "PUBLISHED"]).optional(),
});

const batchReorderSchema = z.object({
  updates: z.array(reorderSchema),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = batchReorderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { updates } = validation.data;

    // Verify all posts belong to user
    const postIds = updates.map((u) => u.postId);
    const posts = await prisma.post.findMany({
      where: {
        id: { in: postIds },
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (posts.length !== postIds.length) {
      return NextResponse.json(
        { success: false, error: "Some posts not found or unauthorized" },
        { status: 403 }
      );
    }

    // Execute all updates in a transaction
    await prisma.$transaction(
      updates.map((update) =>
        prisma.post.update({
          where: { id: update.postId },
          data: {
            calendarDate: update.calendarDate
              ? new Date(update.calendarDate)
              : null,
            calendarOrder: update.calendarOrder,
            ...(update.status && { status: update.status }),
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Posts reordered successfully",
    });
  } catch (error) {
    console.error("PUT /api/posts/reorder error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder posts" },
      { status: 500 }
    );
  }
}