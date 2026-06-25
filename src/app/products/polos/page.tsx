"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PolosCatalog from "@/components/products/PolosCatalog";

function PolosPageContent() {
  const searchParams = useSearchParams();
  const collection = searchParams.get("collection") ?? "all";

  return <PolosCatalog initialCollection={collection} />;
}

export default function PolosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white pt-20">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center text-gray-500">Cargando catálogo...</div>
        </main>
      }
    >
      <PolosPageContent />
    </Suspense>
  );
}
