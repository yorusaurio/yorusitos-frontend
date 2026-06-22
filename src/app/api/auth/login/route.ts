import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, signInWithSupabase, signUpWithSupabase } from "@/backend/auth.server";
import type { AuthProvider } from "@/lib/auth";

async function readBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = await readBody(request);
  const provider = (body.provider ?? "email") as AuthProvider;

  try {
    const user = await signInWithSupabase({
      email: body.email,
      password: body.password,
      provider,
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
  } catch (error) {
    if (provider !== "email") {
      const user = await signUpWithSupabase({
        email: body.email,
        password: body.password,
        firstName: provider,
        lastName: "Demo",
        provider,
        rememberMe: body.rememberMe ?? false,
        termsAccepted: true,
        marketingOptIn: false,
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

    const message = error instanceof Error ? error.message : "Invalid credentials.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
