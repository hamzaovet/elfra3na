import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: [{ sortOrder: "asc" }, { basePrice: "desc" }],
      include: { category: true },
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    console.error("Error in /api/menu:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
