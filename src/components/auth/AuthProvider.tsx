"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth";
import { sanitizeAuthRedirect } from "@/lib/auth-redirect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
	firstName?: string;
	lastName?: string;
	phone?: string;
	termsAccepted?: boolean;
	marketingOptIn?: boolean;
}

interface GoogleSignInOptions {
	next?: string;
	termsAccepted?: boolean;
	marketingOptIn?: boolean;
}

interface AuthContextValue {
	user: AuthUser | null;
	loading: boolean;
	signIn: (credentials: AuthCredentials) => Promise<AuthUser>;
	signUp: (credentials: AuthCredentials) => Promise<AuthUser>;
	signInWithGoogle: (options?: GoogleSignInOptions) => Promise<void>;
	updateProfile: (payload: Partial<Pick<AuthUser, "email" | "firstName" | "lastName" | "phone">>) => Promise<AuthUser>;
	signOut: () => Promise<void>;
	refreshSession: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
	const response = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers || {}),
		},
		credentials: "same-origin",
		cache: "no-store",
	});

	const payload = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(payload.error || "No pudimos completar la solicitud.");
	}

	return payload as T;
}

function buildOAuthCallbackUrl(options?: GoogleSignInOptions) {
	const next = sanitizeAuthRedirect(options?.next);
	const params = new URLSearchParams({ next });

	if (options?.termsAccepted) {
		params.set("terms", "1");
	}

	if (options?.marketingOptIn) {
		params.set("marketing", "1");
	}

	return `${window.location.origin}/auth/callback?${params.toString()}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshSession = async () => {
		try {
			const payload = await requestJson<{ user: AuthUser | null }>("/api/auth/me", { method: "GET" });
			setUser(payload.user);
			return payload.user;
		} catch {
			setUser(null);
			return null;
		}
	};

	useEffect(() => {
		refreshSession().finally(() => setLoading(false));
	}, []);

	const signIn = async (credentials: AuthCredentials) => {
		const payload = await requestJson<{ user: AuthUser }>("/api/auth/login", {
			method: "POST",
			body: JSON.stringify(credentials),
		});

		setUser(payload.user);
		return payload.user;
	};

	const signUp = async (credentials: AuthCredentials) => {
		const payload = await requestJson<{ user: AuthUser }>("/api/auth/register", {
			method: "POST",
			body: JSON.stringify(credentials),
		});

		setUser(payload.user);
		return payload.user;
	};

	const signInWithGoogle = async (options?: GoogleSignInOptions) => {
		const supabase = createSupabaseBrowserClient();
		const redirectTo = buildOAuthCallbackUrl(options);
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo,
				skipBrowserRedirect: true,
				queryParams: {
					access_type: "offline",
					prompt: "consent",
				},
			},
		});

		if (error) {
			throw new Error(error.message || "No se pudo iniciar sesión con Google.");
		}

		if (!data.url) {
			throw new Error("No se recibió la URL de autenticación de Google.");
		}

		window.location.assign(data.url);
	};

	const updateProfile = async (
		payload: Partial<Pick<AuthUser, "email" | "firstName" | "lastName" | "phone">>
	) => {
		const response = await requestJson<{ user: AuthUser }>("/api/account/profile", {
			method: "PATCH",
			body: JSON.stringify(payload),
		});

		setUser(response.user);
		return response.user;
	};

	const signOut = async () => {
		await requestJson<{ ok: true }>("/api/auth/logout", { method: "POST" });
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, signIn, signUp, signInWithGoogle, updateProfile, signOut, refreshSession }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}

	return context;
}
