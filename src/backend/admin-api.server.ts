import { AUTH_COOKIE_NAME, parseSessionUser } from "@/backend/auth.server";

function getCookieValue(request: Request) {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(AUTH_COOKIE_NAME.length + 1);
}

export function getSessionUserFromRequest(request: Request) {
  const rawCookie = getCookieValue(request);
  return parseSessionUser(rawCookie ? decodeURIComponent(rawCookie) : null);
}

export async function readJsonBody<T>(request: Request): Promise<Partial<T>> {
  try {
    const text = await request.text();
    if (!text) return {};

    try {
      return JSON.parse(text) as Partial<T>;
    } catch {
      return {};
    }
  } catch {
    return {};
  }
}
