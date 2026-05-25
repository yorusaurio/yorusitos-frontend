import { NextResponse } from "next/server";
import { createOrder, listOrders } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminOrder } from "@/lib/admin-data";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const body = await readJsonBody<Omit<AdminOrder, "id">>(request);

  if (!body.customer || !body.status || typeof body.total !== "number") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const order = createOrder({
    customer: body.customer,
    status: body.status,
    total: body.total,
  });

  return NextResponse.json({ order }, { status: 201 });
}
