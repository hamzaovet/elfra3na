import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let cachedProducts: any = null;
let lastProductsTime = 0;
const PRODUCTS_TTL_MS = 15_000;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedProducts && now - lastProductsTime < PRODUCTS_TTL_MS) {
      return NextResponse.json(cachedProducts);
    }

    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { basePrice: "desc" }],
      include: { category: true },
    });
    cachedProducts = products;
    lastProductsTime = now;
    return NextResponse.json(products);
  } catch (err: unknown) {
    console.error("Error fetching products:", err);
    if (cachedProducts) return NextResponse.json(cachedProducts);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({ data: body });
    cachedProducts = null;
    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
