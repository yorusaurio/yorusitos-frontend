import { NextResponse } from "next/server";
import { listInventoryProducts } from "@/backend/admin-data.server";
import {
  filterStorefrontProducts,
  findStorefrontProductDetail,
} from "@/lib/storefront-products";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const productId = Number(id);

    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "Producto no válido." }, { status: 400 });
    }

    const inventoryProducts = await listInventoryProducts();
    const product = findStorefrontProductDetail(inventoryProducts, productId);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
    }

    const related = filterStorefrontProducts(inventoryProducts, {
      collection: product.collection,
    })
      .filter((item) => item.id !== product.id)
      .slice(0, 4);

    return NextResponse.json({ product, related });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo cargar el producto.",
      },
      { status: 500 },
    );
  }
}
