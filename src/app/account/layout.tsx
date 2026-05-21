import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, parseSessionUser } from "@/backend/auth.server";

export default function AccountLayout({ children }: { children: ReactNode }) {
  const cookieValue = cookies().get(AUTH_COOKIE_NAME)?.value;
  const user = parseSessionUser(cookieValue ? decodeURIComponent(cookieValue) : null);

  if (!user) {
    redirect("/login?next=/account");
  }

  return children;
}
