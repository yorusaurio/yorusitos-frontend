"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCashRegister,
  faReceipt,
  faBox,
  faAddressBook,
  faStore,
  faGear,
  faClipboardList,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface AdminShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

interface AdminNavItem {
  href: string;
  label: string;
  icon: IconDefinition;
  badge?: string;
}

const navItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: faChartLine },
  { href: "/admin/pos", label: "Punto de ventas", icon: faCashRegister },
  { href: "/admin/sales", label: "Ventas", icon: faReceipt },
  { href: "/admin/orders", label: "Pedidos", icon: faClipboardList, badge: "MVP+" },
  { href: "/admin/inventory", label: "Inventario", icon: faBox },
  { href: "/admin/contacts", label: "Contactos", icon: faAddressBook },
  { href: "/admin/customers", label: "Clientes", icon: faUsers, badge: "MVP+" },
  { href: "/admin/store", label: "Tienda online", icon: faStore },
  { href: "/admin/settings", label: "Configuracion", icon: faGear },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-zinc-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-zinc-200 bg-white/80 p-5 backdrop-blur lg:border-b-0 lg:border-r">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Yorusito Admin</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Panel</h1>
          </div>

          <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-black text-white shadow"
                      : "bg-white text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge ? (
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        active ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700",
                      ].join(" ")}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <header className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-zinc-600">{subtitle}</p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
