import { NextResponse } from "next/server";
import { createContact, listContacts } from "@/backend/admin-data.server";
import { getSessionUserFromRequest, readJsonBody } from "@/backend/admin-api.server";
import type { AdminContact } from "@/lib/admin-data";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  return NextResponse.json({ contacts: listContacts() });
}

export async function POST(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const body = await readJsonBody<Omit<AdminContact, "id">>(request);

  if (!body.name || !body.channel || !body.issue || !body.priority || !body.status) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const contact = createContact({
    name: body.name,
    channel: body.channel,
    issue: body.issue,
    priority: body.priority,
    status: body.status,
  });

  return NextResponse.json({ contact }, { status: 201 });
}
