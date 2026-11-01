import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: [{ sortOrder: "asc" }],
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        categoryName: true,
        basePrice: true,
        originalPrice: true,
        promoPrice: true,
        promoActive: true,
        isWeightItem: true,
        scaleItemCode: true,
        sizes: true,
        image: true,
        description: true,
        isAvailable: true,
        sortOrder: true,
      },
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
