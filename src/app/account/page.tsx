"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faGear, faHeart } from "@fortawesome/free-solid-svg-icons";
import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/account");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-transparent" />;
  }

  const quickActions = [
    { href: "/account/settings", title: "Configuración de perfil", description: "Actualiza tu nombre, correo y teléfono.", icon: faGear },
    { href: "/account/orders", title: "Mis órdenes", description: "Sigue el estado de tus pedidos recientes.", icon: faBoxOpen },
    { href: "/account/wishlist", title: "Mi lista de deseos", description: "Consulta lo que guardaste para después.", icon: faHeart },
  ];

  return (
    <AccountShell
      title={`Hola, ${user.displayName}`}
      description="Este espacio reúne tu perfil, órdenes y lista de deseos. La base ya está lista para conectarse con tu backend real cuando quieras evolucionarlo."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Perfil", value: user.email, note: user.provider === "email" ? "Acceso por correo" : `Conectado con ${user.provider}` },
          { label: "Sesión", value: user.rememberMe ? "Recordada" : "Temporal", note: "Puedes cerrar sesión cuando quieras" },
          { label: "Acción rápida", value: "Editar perfil", note: "Desde la pantalla de configuración" },
        ].map((item) => (
          <article key={item.label} className="rounded-3xl border border-zinc-200 bg-[#faf7f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{item.label}</p>
            <h2 className="mt-3 text-xl font-black text-zinc-950">{item.value}</h2>
            <p className="mt-2 text-sm text-zinc-600">{item.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className="group rounded-[1.75rem] border border-zinc-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <FontAwesomeIcon icon={action.icon} className="text-xl text-zinc-950" />
              <span className="text-zinc-400 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </div>
            <h3 className="mt-6 text-xl font-bold text-zinc-950">{action.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{action.description}</p>
          </Link>
        ))}
      </div>
    </AccountShell>
  );
}
