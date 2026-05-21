"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthProvider";
import type { AccountOrder } from "@/lib/account-data";

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<AccountOrder[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/account/orders");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/account/orders", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setOrders(payload.orders || []));
  }, [user]);

  if (loading || !user) return <div className="min-h-screen bg-transparent" />;

  return (
    <AccountShell title="Mis órdenes" description="Consulta aquí el historial y el estado de tus pedidos. La estructura ya está lista para conectar con tu backend real.">
      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[1.75rem] border border-zinc-200 bg-[#faf7f2] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Pedido</p>
                <h2 className="mt-2 text-2xl font-black text-zinc-950">{order.id}</h2>
                <p className="mt-1 text-sm text-zinc-600">Comprado el {order.placedAt} · {order.shipping}</p>
              </div>
              <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white">{order.status}</div>
            </div>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-950">{item.name}</h3>
                    <p className="text-sm text-zinc-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-zinc-950">S/ {(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-3xl bg-zinc-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Total</p>
              <h3 className="mt-2 text-3xl font-black">S/ {order.total.toFixed(2)}</h3>
            </div>
          </article>
        ))}
      </div>
    </AccountShell>
  );
}
