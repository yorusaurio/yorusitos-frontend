"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeAuthRedirect } from "@/lib/auth-redirect";
import { createSupabaseBrowserClient, clearSupabaseBrowserSession } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completando inicio de sesión con Google...");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    async function completeOAuth() {
      const oauthError = searchParams.get("error_description") || searchParams.get("error");
      if (oauthError) {
        router.replace(`/login?error=${encodeURIComponent(oauthError)}`);
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        router.replace("/login?error=oauth");
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session?.access_token) {
          throw new Error(error?.message || "No se pudo validar la sesión de Google.");
        }

        const response = await fetch("/api/auth/oauth/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({
            next: searchParams.get("next"),
            termsAccepted: searchParams.get("terms") === "1",
            marketingOptIn: searchParams.get("marketing") === "1",
          }),
          credentials: "same-origin",
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "No se pudo crear la sesión.");
        }

        await clearSupabaseBrowserSession();

        if (cancelled) return;

        router.replace(sanitizeAuthRedirect(typeof payload.next === "string" ? payload.next : searchParams.get("next")));
      } catch (error) {
        if (cancelled) return;

        const text = error instanceof Error ? error.message : "No se pudo completar el inicio de sesión.";
        setMessage(text);
        router.replace(`/login?error=${encodeURIComponent(text)}`);
      }
    }

    completeOAuth();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <p className="text-sm text-zinc-600">{message}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <p className="text-sm text-zinc-600">Completando inicio de sesión con Google...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
