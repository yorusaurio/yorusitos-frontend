"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBoxOpen, faGear, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/account", label: "Mi cuenta", icon: faUser },
  { href: "/account/settings", label: "Configuración", icon: faGear },
  { href: "/account/orders", label: "Mis órdenes", icon: faBoxOpen },
  { href: "/account/wishlist", label: "Wishlist", icon: faHeart },
];

export default function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  const firstName = user?.firstName?.trim().split(/\s+/)[0] || user?.displayName?.trim().split(/\s+/)[0] || "";

  return (
    <div className="bg-transparent px-4 pt-28 pb-16 lg:px-8 lg:pt-32 lg:pb-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_25px_70px_rgba(0,0,0,0.06)]">
          <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Cuenta</p>
            <h2 className="mt-3 text-2xl font-black">{firstName || "Cliente"}</h2>
            <p className="mt-2 text-sm text-zinc-300">{user?.email}</p>
          </div>

          <nav className="mt-5 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            Cerrar sesión
          </button>
        </aside>

        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_25px_70px_rgba(0,0,0,0.06)] lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Yorusito</p>
          <h1 className="mt-3 text-3xl font-black text-zinc-950 lg:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </div>
  );
}
