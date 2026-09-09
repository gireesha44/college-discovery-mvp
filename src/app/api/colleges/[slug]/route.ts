import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" } },
        reviews: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    return NextResponse.json({ data: college });
  } catch (err) {
    console.error(`GET /api/colleges/${slug} failed`, err);
    return NextResponse.json({ error: "Failed to fetch college" }, { status: 500 });
  }
}
