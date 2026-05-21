"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountShell from "@/components/account/AccountShell";
import { useAuth } from "@/components/auth/AuthProvider";
import type { WishlistItem } from "@/lib/account-data";

export default function AccountWishlistPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/account/wishlist");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/account/wishlist", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setItems(payload.items || []));
  }, [user]);

  if (loading || !user) return <div className="min-h-screen bg-transparent" />;

  return (
    <AccountShell title="Wishlist" description="Guarda aquí las piezas que quieres revisar después. La lista ya está conectada a tu sesión actual.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-[#faf7f2]">
            <img src={item.image} alt={item.name} className="h-64 w-full object-cover" />
            <div className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{item.collection}</p>
              <h3 className="text-xl font-bold text-zinc-950">{item.name}</h3>
              <p className="text-lg font-black text-zinc-950">S/ {item.price.toFixed(2)}</p>
            </div>
          </article>
        ))}
      </div>
    </AccountShell>
  );
}
