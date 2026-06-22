import { NextResponse } from "next/server";
import { listCustomerInsights } from "@/backend/admin-data.server";
import { getSessionUserFromRequest } from "@/backend/admin-api.server";

export async function GET(request: Request) {
  const user = getSessionUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "No active session." }, { status: 401 });
  }

  const payload = await listCustomerInsights();
  return NextResponse.json(payload);
}
