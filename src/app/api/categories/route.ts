// ============================================
// Categories API — List & Create
// ============================================
// GET  /api/categories  → List user categories
// POST /api/categories  → Create category

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().optional(),
});

// ---- GET: List Categories ----
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ---- POST: Create Category ----
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, color } = validation.data;

    // Check for duplicate name
    const existing = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        name: { equals: name },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A category with this name already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        color: color || "#6366F1",
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}