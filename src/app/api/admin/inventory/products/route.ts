import { NextResponse } from "next/server";
import { upsertInventoryProduct } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminInventoryProductInput } from "@/lib/admin-data";

export async function POST(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const body = await readJsonBody<AdminInventoryProductInput>(request);

  if (!body.product || typeof body.basePrice !== "number") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const product = await upsertInventoryProduct({
    productId: body.productId,
    parentSku: body.parentSku,
    product: body.product,
    description: body.description,
    category: body.category,
    collection: body.collection,
    image: body.image,
    basePrice: body.basePrice,
    colors: body.colors?.length ? body.colors : ["UNICO"],
    sizes: body.sizes?.length ? body.sizes : ["STD"],
    sizePrices: body.sizePrices,
    sizeStocks: body.sizeStocks,
    defaultStock: body.defaultStock,
    lowStockThreshold: body.lowStockThreshold,
    status: body.status,
    warehouse: body.warehouse,
  });

  return NextResponse.json({ product });
}
