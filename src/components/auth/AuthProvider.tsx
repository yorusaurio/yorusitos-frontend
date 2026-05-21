"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthProvider as AuthProviderName, AuthUser } from "@/lib/auth";

interface AuthCredentials {
	email: string;
	password: string;
	rememberMe?: boolean;
	firstName?: string;
	lastName?: string;
	phone?: string;
}

interface AuthContextValue {
	user: AuthUser | null;
	loading: boolean;
	signIn: (credentials: AuthCredentials) => Promise<AuthUser>;
	signUp: (credentials: AuthCredentials) => Promise<AuthUser>;
	signInWithProvider: (provider: Exclude<AuthProviderName, "email">) => Promise<AuthUser>;
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

	const signInWithProvider = async (provider: Exclude<AuthProviderName, "email">) => {
		const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
		return signIn({
			email: `${provider}@yorusito.social`,
			password: provider,
			firstName: providerName,
			lastName: "Account",
			rememberMe: true,
		});
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
			value={{ user, loading, signIn, signUp, signInWithProvider, updateProfile, signOut, refreshSession }}
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
