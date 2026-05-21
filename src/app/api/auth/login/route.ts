import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createSessionUser } from "@/backend/auth.server";

async function readBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = await readBody(request);
  const user = createSessionUser({
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    provider: body.provider ?? "email",
    rememberMe: body.rememberMe ?? false,
  });

  const response = NextResponse.json({ user });
  response.cookies.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: user.rememberMe ? 60 * 60 * 24 * 30 : undefined,
  });

  return response;
}
