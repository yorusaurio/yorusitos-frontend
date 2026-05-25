import { NextResponse } from "next/server";
import { createSale, listSales } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminSale } from "@/lib/admin-data";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  return NextResponse.json({ sales: listSales() });
}

export async function POST(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const body = await readJsonBody<Omit<AdminSale, "id">>(request);

  if (!body.customer || !body.channel || !body.status || typeof body.amount !== "number") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const sale = createSale({
    orderNumber: body.orderNumber,
    placedAt: body.placedAt,
    customerId: body.customerId,
    customerDni: body.customerDni,
    customerAddress: body.customerAddress,
    customer: body.customer,
    channel: body.channel,
    status: body.status,
    customerType: body.customerType,
    currency: body.currency,
    exchangeRate: body.exchangeRate,
    subtotal: body.subtotal,
    discountTotal: body.discountTotal,
    shippingTotal: body.shippingTotal,
    taxTotal: body.taxTotal,
    amount: body.amount,
    paymentStatus: body.paymentStatus,
    source: body.source,
    notes: body.notes,
    salesRepId: body.salesRepId,
  });

  return NextResponse.json({ sale }, { status: 201 });
}
