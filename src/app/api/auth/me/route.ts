import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, parseSessionUser } from "@/backend/auth.server";

export async function GET(request: Request) {
  const cookieValue = request.headers.get("cookie")
    ?.split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(AUTH_COOKIE_NAME.length + 1);

  const user = parseSessionUser(cookieValue ? decodeURIComponent(cookieValue) : null);
  return NextResponse.json({ user });
}
