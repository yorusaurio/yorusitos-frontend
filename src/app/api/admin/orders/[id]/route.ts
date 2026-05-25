import { NextResponse } from "next/server";
import { deleteOrder, updateOrder } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminOrder } from "@/lib/admin-data";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await readJsonBody<Partial<Omit<AdminOrder, "id">>>(request);
  const order = updateOrder(id, body);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = deleteOrder(id);

  if (!deleted) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
