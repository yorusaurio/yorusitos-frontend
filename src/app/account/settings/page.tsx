"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/account/settings");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateProfile({ email, firstName, lastName, phone });
      setMessage("Configuración actualizada correctamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen bg-transparent" />;

  return (
    <AccountShell title="Configuración de perfil" description="Actualiza tu información personal, correo y teléfono. La pantalla ya está conectada a la sesión actual.">
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">Correo electrónico</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3.5" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">Nombres</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3.5" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-zinc-800">Apellidos</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3.5" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">Teléfono</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3.5" />
        </label>
        {message && <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        <div className="md:col-span-2 flex justify-end">
          <button disabled={saving} className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">{saving ? "Guardando..." : "Guardar cambios"}</button>
        </div>
      </form>
    </AccountShell>
  );
}
