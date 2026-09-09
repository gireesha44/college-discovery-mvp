import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compareQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const parsed = compareQuerySchema.safeParse({
    slugs: req.nextUrl.searchParams.get("slugs") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid comparison request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { slugs } = parsed.data;

  try {
    const colleges = await prisma.college.findMany({
      where: { slug: { in: slugs } },
      include: {
        placements: { orderBy: { year: "desc" }, take: 1 },
        courses: true,
      },
    });

    // preserve requested order for a stable comparison layout
    const ordered = slugs
      .map((s) => colleges.find((c) => c.slug === s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

    if (ordered.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid colleges are required to compare" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: ordered });
  } catch (err) {
    console.error("GET /api/colleges/compare failed", err);
    return NextResponse.json({ error: "Failed to fetch comparison" }, { status: 500 });
  }
}
