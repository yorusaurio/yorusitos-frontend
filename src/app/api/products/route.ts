import { NextResponse } from "next/server";
import { listInventoryProducts } from "@/backend/admin-data.server";
import { filterStorefrontProducts } from "@/lib/storefront-products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const limitParam = Number(searchParams.get("limit") ?? "0");
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;

    const inventoryProducts = await listInventoryProducts();
    const products = filterStorefrontProducts(inventoryProducts, { collection, category, limit });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudieron cargar los productos.",
        products: [],
      },
      { status: 500 },
    );
  }
}
