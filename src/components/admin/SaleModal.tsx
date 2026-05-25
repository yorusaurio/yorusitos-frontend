"use client";

import React, { FormEvent } from "react";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminSale } from "@/lib/admin-data";

type SaleForm = Omit<AdminSale, "id">;

interface Props {
  isOpen: boolean;
  title: string;
  saving: boolean;
  hasUnsavedChanges: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  form: SaleForm;
  setForm: React.Dispatch<React.SetStateAction<SaleForm>>;
  sellerName: string;
  editingId: string | null;
  updateMoneyField: (field: "subtotal" | "discountTotal" | "shippingTotal" | "taxTotal", value: string) => void;
  computedSaleAmount: number;
}

export default function SaleModal({
  isOpen,
  title,
  saving,
  hasUnsavedChanges,
  onClose,
  onSubmit,
  form,
  setForm,
  sellerName,
  editingId,
  updateMoneyField,
  computedSaleAmount,
}: Props) {
  return (
    <CrudModal
      isOpen={isOpen}
      title={title}
      saving={saving}
      hasUnsavedChanges={hasUnsavedChanges}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div className="space-y-5">
        {/* Row 1: Order number + Fecha */}
        <div className="grid gap-3 sm:grid-cols-[120px_160px]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Order number</span>
            <input
              type="text"
              value={form.orderNumber || editingId || ""}
              readOnly
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Fecha</span>
            <input
              type="date"
              value={form.placedAt}
              onChange={(event) => setForm((previous) => ({ ...previous, placedAt: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none"
            />
          </label>
        </div>

        {/* Row 2: Vendedor + Canal + Moneda + Tasa de cambio */}
        <div className="grid gap-3 sm:grid-cols-[350px_120px_120px_120px]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Vendedor</span>
            <input
              type="text"
              value={sellerName}
              readOnly
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Canal</span>
            <select
              value={form.channel}
              onChange={(event) => setForm((previous) => ({ ...previous, channel: event.target.value as SaleForm["channel"] }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            >
              <option value="online">Online</option>
              <option value="pos">POS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Moneda</span>
            <select
              value={form.currency}
              onChange={(event) => setForm((previous) => ({ ...previous, currency: event.target.value as SaleForm["currency"] }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            >
              <option value="SOLES">SOLES</option>
              <option value="DOLARES">DÓLARES</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Tasa de cambio</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.exchangeRate ?? 1}
              onChange={(event) => setForm((previous) => ({ ...previous, exchangeRate: Number(event.target.value) }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none"
            />
          </label>
        </div>

        {/* Row 3: Documento + Cliente + Tipo de Cliente */}
        <div className="grid gap-3 sm:grid-cols-[120px_350px_120px]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DOCUMENTO</span>
            <input
              type="text"
              value={form.customerDni || ""}
              onChange={(event) => setForm((previous) => ({ ...previous, customerDni: event.target.value }))}
              placeholder="Documento (DNI / RUC)"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Cliente</span>
            <input
              type="text"
              value={form.customer}
              onChange={(event) => setForm((previous) => ({ ...previous, customer: event.target.value }))}
              placeholder="Nombre completo del cliente"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Tipo de cliente</span>
            <select
              value={form.customerType}
              onChange={(event) => setForm((previous) => ({ ...previous, customerType: event.target.value as SaleForm["customerType"] }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            >
              <option value="MINORISTA">MINORISTA</option>
              <option value="MAYORISTA">MAYORISTA</option>
            </select>
          </label>

          {/* Dirección moved below */}
        </div>

        {/* Dirección: full width below DNI/Cliente/Tipo */}
        <div>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Dirección</span>
            <input
              type="text"
              value={form.customerAddress || ""}
              onChange={(event) => setForm((previous) => ({ ...previous, customerAddress: event.target.value }))}
              placeholder="Dirección del cliente"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <label className="space-y-1.5 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Notas</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((previous) => ({ ...previous, notes: event.target.value }))}
              placeholder="Notas internas"
              rows={2}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </label>

          <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Subtotal</span>
                <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-3 shadow-sm transition focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200">
                  <span className="pr-2 text-sm font-semibold text-zinc-500">S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.subtotal ?? 0}
                    onChange={(event) => updateMoneyField("subtotal", event.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm text-zinc-900 outline-none"
                  />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Discount total</span>
                <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-3 shadow-sm transition focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200">
                  <span className="pr-2 text-sm font-semibold text-zinc-500">S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discountTotal ?? 0}
                    onChange={(event) => updateMoneyField("discountTotal", event.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm text-zinc-900 outline-none"
                  />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Shipping total</span>
                <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-3 shadow-sm transition focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200">
                  <span className="pr-2 text-sm font-semibold text-zinc-500">S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.shippingTotal ?? 0}
                    onChange={(event) => updateMoneyField("shippingTotal", event.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm text-zinc-900 outline-none"
                  />
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">Tax total</span>
                <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-3 shadow-sm transition focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200">
                  <span className="pr-2 text-sm font-semibold text-zinc-500">S/</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.taxTotal ?? 0}
                    onChange={(event) => updateMoneyField("taxTotal", event.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm text-zinc-900 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-3 rounded-2xl bg-zinc-950 p-4 text-white sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Amount total</p>
                <p className="mt-1 text-sm text-zinc-300">Se calcula solo con subtotal, descuento, envío e IGV.</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold">{form.currency === "DOLARES" ? "$" : "S/"} {computedSaleAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CrudModal>
  );
}
