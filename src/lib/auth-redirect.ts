export function sanitizeAuthRedirect(path: string | null | undefined, fallback = "/home") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  return path;
}
