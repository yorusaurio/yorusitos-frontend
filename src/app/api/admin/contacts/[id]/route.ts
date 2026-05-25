import { NextResponse } from "next/server";
import { deleteContact, updateContact } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminContact } from "@/lib/admin-data";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await readJsonBody<Partial<Omit<AdminContact, "id">>>(request);
  const contact = updateContact(id, body);

  if (!contact) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  return NextResponse.json({ contact });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = deleteContact(id);

  if (!deleted) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
