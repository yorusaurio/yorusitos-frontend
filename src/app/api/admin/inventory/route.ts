import { NextResponse } from "next/server";
import { createInventoryItem, listInventory, listInventoryProducts } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminInventoryItem } from "@/lib/admin-data";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const [inventory, products] = await Promise.all([listInventory(), listInventoryProducts()]);
  return NextResponse.json({ inventory, products });
}

export async function POST(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const body = await readJsonBody<AdminInventoryItem>(request);

  if (!body.sku || !body.product || !body.warehouse || typeof body.onHand !== "number" || typeof body.reserved !== "number") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const item = await createInventoryItem({
    sku: body.sku,
    parentSku: body.parentSku,
    productId: body.productId,
    product: body.product,
    description: body.description,
    category: body.category,
    collection: body.collection,
    color: body.color,
    size: body.size,
    options: body.options,
    price: body.price,
    image: body.image,
    warehouse: body.warehouse,
    onHand: body.onHand,
    reserved: body.reserved,
    sold: body.sold,
    lowStockThreshold: body.lowStockThreshold,
    status: body.status,
  });

  if (!item) {
    return NextResponse.json({ error: "SKU already exists." }, { status: 409 });
  }

  return NextResponse.json({ item }, { status: 201 });
}
