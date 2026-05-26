"use client";

import React, { FormEvent } from "react";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminSale } from "@/lib/admin-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

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
        <div className="space-y-0">
          {/* Row 1: Order number + Fecha */}
          <div className="grid gap-3 sm:grid-cols-[120px_160px_minmax(0,1fr)]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">ORDER NUMBER</span>
            <input
              type="text"
              value={form.orderNumber || editingId || ""}
              readOnly
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold uppercase text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">FECHA</span>
            <input
              type="date"
              value={form.placedAt}
              onChange={(event) => setForm((previous) => ({ ...previous, placedAt: event.target.value }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none"
            />
          </label>
          <div aria-hidden="true" />
          </div>

          {/* Row 2: Vendedor + Canal + Moneda + Tasa de cambio */}
          <div className="grid gap-3 sm:grid-cols-[450px_120px_120px_minmax(0,1fr)]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">VENDEDOR</span>
            <input
              type="text"
              value={sellerName}
              readOnly
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold uppercase text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">MONEDA</span>
            <select
              value={form.currency}
              onChange={(event) => setForm((previous) => ({ ...previous, currency: event.target.value as SaleForm["currency"] }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm uppercase text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            >
              <option value="SOLES">SOLES</option>
              <option value="DOLARES">DÓLARES</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">TASA DE CAMBIO</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.exchangeRate ?? 1}
              readOnly
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold uppercase text-zinc-900 shadow-sm outline-none"
            />
          </label>
          <div aria-hidden="true" />
          </div>

          {/* Row 3: Documento + Cliente + Tipo de Cliente */}
          <div className="grid gap-3 sm:grid-cols-[120px_36px_450px_120px_minmax(0,1fr)]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DOCUMENTO</span>
            <input
              type="text"
              value={form.customerDni || ""}
              onChange={(event) => setForm((previous) => ({ ...previous, customerDni: event.target.value }))}
              placeholder=""
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm uppercase text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <div className="flex items-end pb-1">
            <button
              type="button"
              aria-label="Buscar documento"
              title="Buscar documento"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 transition hover:bg-zinc-100"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-3 w-3" />
            </button>
          </div>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">CLIENTE</span>
            <input
              type="text"
              value={form.customer}
              readOnly
              placeholder=""
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold uppercase text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">TIPO DE CLIENTE</span>
            <select
              value={form.customerType}
              onChange={(event) => setForm((previous) => ({ ...previous, customerType: event.target.value as SaleForm["customerType"] }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm uppercase text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            >
              <option value="MINORISTA">MINORISTA</option>
              <option value="MAYORISTA">MAYORISTA</option>
            </select>
          </label>
          <div aria-hidden="true" />

          {/* Dirección moved below */}
          </div>

          {/* Dirección: full width below DNI/Cliente/Tipo */}
          <div className="grid gap-3 sm:grid-cols-[500px_120px_minmax(0,1fr)]">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DIRECCION</span>
            <input
              type="text"
              value={form.customerAddress || ""}
              readOnly
              placeholder=""
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm font-semibold uppercase text-zinc-900 shadow-sm outline-none"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">CANAL</span>
            <select
              value={form.channel}
              onChange={(event) => setForm((previous) => ({ ...previous, channel: event.target.value as SaleForm["channel"] }))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm uppercase text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            >
              <option value="online">ONLINE</option>
              <option value="pos">POS</option>
              <option value="whatsapp">WHATSAPP</option>
            </select>
          </label>
          <div aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
              aria-label="Nuevo"
              title="Nuevo"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
              aria-label="Editar"
              title="Editar"
            >
              <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
              aria-label="Eliminar"
              title="Eliminar"
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3">Item</th>
                  <th className="whitespace-nowrap px-3 py-3">Código</th>
                  <th className="whitespace-nowrap px-3 py-3">Descripción</th>
                  <th className="whitespace-nowrap px-3 py-3">Medida</th>
                  <th className="whitespace-nowrap px-3 py-3">U.M</th>
                  <th className="whitespace-nowrap px-3 py-3">Cant.</th>
                  <th className="whitespace-nowrap px-3 py-3">%Dscto</th>
                  <th className="whitespace-nowrap px-3 py-3">P.Venta</th>
                  <th className="whitespace-nowrap px-3 py-3">V.Venta</th>
                  <th className="whitespace-nowrap px-3 py-3">Muestra</th>
                  <th className="whitespace-nowrap px-3 py-3">Promoción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-zinc-200 bg-white">
                  <td className="px-3 py-3 text-zinc-500" colSpan={11}>
                    Sin items agregados todavía.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
          <label className="space-y-1.5 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-600">NOTAS</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((previous) => ({ ...previous, notes: event.target.value }))}
              placeholder="Notas internas"
              rows={2}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm uppercase text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
            />
          </label>

          <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm lg:col-span-2">
            <div className="ml-auto w-[108px] space-y-2">
              <label className="block space-y-1">
                <span className="block text-right text-[10px] font-semibold uppercase tracking-wide text-zinc-600">SHIPPING TOTAL</span>
                <div className="flex w-full items-center rounded-lg border border-zinc-300 bg-zinc-100 px-2 shadow-sm">
                  <span className="pr-1 text-xs font-semibold text-zinc-500">S/</span>
                  <input
                    type="text"
                    value={(form.shippingTotal ?? 0).toFixed(2)}
                    readOnly
                    className="w-full bg-transparent py-1.5 text-right text-xs font-semibold text-zinc-900 outline-none"
                  />
                </div>
              </label>

              <label className="block space-y-1">
                <span className="block text-right text-[10px] font-semibold uppercase tracking-wide text-zinc-600">DISCOUNT TOTAL</span>
                <div className="flex w-full items-center rounded-lg border border-zinc-300 bg-zinc-100 px-2 shadow-sm">
                  <span className="pr-1 text-xs font-semibold text-zinc-500">S/</span>
                  <input
                    type="text"
                    value={(form.discountTotal ?? 0).toFixed(2)}
                    readOnly
                    className="w-full bg-transparent py-1.5 text-right text-xs font-semibold text-zinc-900 outline-none"
                  />
                </div>
              </label>

              <label className="block space-y-1">
                <span className="block text-right text-[10px] font-semibold uppercase tracking-wide text-zinc-600">SUB TOTAL</span>
                <div className="flex w-full items-center rounded-lg border border-zinc-300 bg-zinc-100 px-2 shadow-sm">
                  <span className="pr-1 text-xs font-semibold text-zinc-500">S/</span>
                  <input
                    type="text"
                    value={(form.subtotal ?? 0).toFixed(2)}
                    readOnly
                    className="w-full bg-transparent py-1.5 text-right text-xs font-semibold text-zinc-900 outline-none"
                  />
                </div>
              </label>

              <label className="block space-y-1">
                <span className="block text-right text-[10px] font-semibold uppercase tracking-wide text-zinc-600">TAX TOTAL</span>
                <div className="flex w-full items-center rounded-lg border border-zinc-300 bg-zinc-100 px-2 shadow-sm">
                  <span className="pr-1 text-xs font-semibold text-zinc-500">S/</span>
                  <input
                    type="text"
                    value={(form.taxTotal ?? 0).toFixed(2)}
                    readOnly
                    className="w-full bg-transparent py-1.5 text-right text-xs font-semibold text-zinc-900 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-2 rounded-xl bg-zinc-950 p-3 text-white">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">AMOUNT TOTAL</p>
                <p className="mt-0.5 text-xs text-zinc-300">Se calcula solo con subtotal, descuento, envío e IGV.</p>
              </div>
              <div className="ml-auto w-[108px] text-right">
                <p className="text-lg font-bold">{form.currency === "DOLARES" ? "$" : "S/"} {computedSaleAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CrudModal>
  );
}
