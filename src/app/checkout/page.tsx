"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { mockProducts } from "@/data/mockProducts";
import { findVariantStock } from "@/lib/product-stock";
import { useProductStock } from "@/hooks/useProductStock";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("productId"));
  const product = mockProducts.find((item) => item.id === productId);
  const quantity = Math.max(1, Number(searchParams.get("quantity")) || 1);
  const selectedColor = searchParams.get("color") || "";
  const selectedSize = searchParams.get("size") || "";
  const [documentType, setDocumentType] = useState("DNI");
  const [receiptType, setReceiptType] = useState("boleta");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const { stock, loading: stockLoading } = useProductStock();
  const productStock = product ? stock[product.id] : undefined;
  const variantStock = findVariantStock(productStock, selectedColor, selectedSize);
  const availableUnits = variantStock?.available ?? productStock?.available ?? 0;
  const stockKnown = Boolean(productStock);
  const canConfirmOrder = Boolean(product && !stockLoading && stockKnown && availableUnits >= quantity);

  const total = (product?.price ?? 0) * quantity;
  const whatsappMessage = useMemo(() => {
    const lines = [
      "Hola, quiero confirmar mi pedido:",
      product ? `Producto: ${product.name}` : "Producto: Pendiente de seleccionar",
      selectedColor ? `Color: ${selectedColor}` : null,
      selectedSize ? `Talla: ${selectedSize}` : null,
      `Cantidad: ${quantity}`,
      product ? `Total referencial: S/ ${total.toFixed(2)}` : null,
    ].filter(Boolean);

    return `https://wa.me/51975885868?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [product, quantity, selectedColor, selectedSize, total]);

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-zinc-950 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Checkout</p>
            <h1 className="mt-3 text-4xl font-black">Datos para tu pedido</h1>
            <p className="mt-2 text-sm text-zinc-600">Completa tus datos de entrega. El pago online se conectara en una siguiente etapa.</p>
          </div>

          <form className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <section className="space-y-4">
              <h2 className="text-lg font-bold">Contacto</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombres *" placeholder="Juan" required />
                <Field label="Apellidos *" placeholder="Perez" required />
                <Field label="Telefono / WhatsApp *" placeholder="987654321" required />
                <Field label="Email *" type="email" placeholder="tu@email.com" required />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold">Comprobante</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-zinc-800">Tipo</span>
                  <select value={receiptType} onChange={(event) => setReceiptType(event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-zinc-950">
                    <option value="boleta">Boleta</option>
                    <option value="factura">Factura</option>
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-zinc-800">Documento</span>
                  <select value={documentType} onChange={(event) => setDocumentType(event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-zinc-950">
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CE">Carnet de extranjeria</option>
                  </select>
                </label>
                <Field label={documentType === "RUC" ? "Numero de RUC *" : "Numero de documento *"} placeholder={documentType === "RUC" ? "20123456789" : "12345678"} required />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold">Direccion de envio</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Departamento *" placeholder="Lima" required />
                <Field label="Provincia *" placeholder="Lima" required />
                <Field label="Distrito *" placeholder="Miraflores" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                <Field label="Direccion *" placeholder="Av. Larco" required />
                <Field label="Numero" placeholder="123" />
              </div>
              <Field label="Referencia" placeholder="Frente al parque, puerta negra, piso 3..." />
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-bold">Metodo de entrega</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-zinc-800">Entrega *</span>
                  <select className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-3 text-sm outline-none focus:border-zinc-950" required>
                    <option value="">Selecciona una opcion</option>
                    <option value="delivery-lima">Delivery Lima</option>
                    <option value="agencia-provincia">Agencia provincia</option>
                    <option value="recojo">Recojo coordinado</option>
                  </select>
                </label>
                <Field label="Agencia preferida" placeholder="Shalom, Olva, Marvisur..." />
              </div>
            </section>

            <label className="flex gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(event) => setMarketingOptIn(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300"
              />
              <span>Deseo recibir promociones, novedades y cupones por WhatsApp o email.</span>
            </label>

            {stockLoading ? (
              <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-600">
                Validando stock disponible...
              </p>
            ) : stockKnown && availableUnits <= 0 ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                Este producto esta sin stock. Vuelve al producto y elige otra variante disponible.
              </p>
            ) : stockKnown && availableUnits < quantity ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                Solo quedan {availableUnits} unidades disponibles para esta variante.
              </p>
            ) : null}

            {canConfirmOrder ? (
              <a href={whatsappMessage} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center rounded-2xl bg-zinc-950 px-5 py-4 text-base font-semibold text-white transition hover:bg-zinc-800">
                Confirmar pedido por WhatsApp
              </a>
            ) : (
              <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-zinc-200 px-5 py-4 text-base font-semibold text-zinc-500">
                Sin stock
              </button>
            )}
          </form>
        </div>

        <aside className="h-fit rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
          <h2 className="text-lg font-bold">Resumen</h2>
          {product ? (
            <div className="mt-4 space-y-4">
              <div className="flex gap-4">
                <img src={product.images[0]} alt={product.name} className="h-24 w-24 rounded-xl object-cover" />
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-zinc-600">Color: {selectedColor || "Por confirmar"}</p>
                  <p className="text-sm text-zinc-600">Talla: {selectedSize || "Por confirmar"}</p>
                  <p className="text-sm text-zinc-600">Cantidad: {quantity}</p>
                  {stockKnown ? (
                    <p className={`mt-2 text-sm font-bold ${availableUnits > 0 ? "text-emerald-700" : "text-red-700"}`}>
                      {availableUnits > 0 ? `${availableUnits} disponibles` : "Sin stock"}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="border-t border-zinc-200 pt-4">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>Subtotal</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-zinc-600">
                  <span>Envio</span>
                  <span>Por calcular</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-black">
                  <span>Total referencial</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              <p>No hay un producto seleccionado para checkout.</p>
              <Link href="/products" className="inline-flex rounded-xl border border-zinc-300 px-4 py-2 font-semibold text-zinc-950 transition hover:bg-white">
                Ver productos
              </Link>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-3 text-sm outline-none transition focus:border-zinc-950"
      />
    </label>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutForm />
    </Suspense>
  );
}
