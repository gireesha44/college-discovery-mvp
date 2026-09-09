import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { collegeListQuerySchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const parsed = collegeListQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { q, state, type, minFees, maxFees, minRating, sort, page, pageSize } = parsed.data;

  const where: Prisma.CollegeWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      state ? { state: { equals: state, mode: "insensitive" } } : {},
      type ? { type } : {},
      minFees !== undefined ? { fees: { gte: minFees } } : {},
      maxFees !== undefined ? { fees: { lte: maxFees } } : {},
      minRating !== undefined ? { rating: { gte: minRating } } : {},
    ],
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "rating_desc"
      ? { rating: "desc" }
      : sort === "fees_asc"
      ? { fees: "asc" }
      : sort === "fees_desc"
      ? { fees: "desc" }
      : { name: "asc" };

  try {
    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          state: true,
          type: true,
          fees: true,
          rating: true,
          logoColor: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: colleges,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        hasMore: page * pageSize < total,
      },
    });
  } catch (err) {
    console.error("GET /api/colleges failed", err);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}
