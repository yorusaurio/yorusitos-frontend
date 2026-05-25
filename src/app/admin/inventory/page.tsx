"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminInventoryItem } from "@/lib/admin-data";

type InventoryForm = AdminInventoryItem;

const initialForm: InventoryForm = {
  sku: "",
  product: "",
  onHand: 0,
  reserved: 0,
  warehouse: "Principal",
};

export default function AdminInventoryPage() {
  const [inventoryRows, setInventoryRows] = useState<AdminInventoryItem[]>([]);
  const [form, setForm] = useState<InventoryForm>(initialForm);
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchInventory() {
    const response = await fetch("/api/admin/inventory", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo cargar inventario.");
    }

    setInventoryRows(payload.inventory || []);
  }

  useEffect(() => {
    fetchInventory()
      .catch((caughtError: unknown) => setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar inventario."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const endpoint = editingSku ? `/api/admin/inventory/${editingSku}` : "/api/admin/inventory";
      const payload = editingSku
        ? {
          product: form.product,
          onHand: form.onHand,
          reserved: form.reserved,
          warehouse: form.warehouse,
        }
        : form;

      const response = await fetch(endpoint, {
        method: editingSku ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "No se pudo guardar el SKU.");
      }

      await fetchInventory();
      setForm(initialForm);
      setEditingSku(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el SKU.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(sku: string) {
    if (!window.confirm("Eliminar este SKU?")) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/inventory/${sku}`, { method: "DELETE" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo eliminar el SKU.");
      }

      await fetchInventory();
      if (editingSku === sku) {
        setEditingSku(null);
        setForm(initialForm);
        setIsModalOpen(false);
      }
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar el SKU.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(row: AdminInventoryItem) {
    setEditingSku(row.sku);
    setForm({ ...row });
    setIsModalOpen(true);
  }

  function handleCreate() {
    setEditingSku(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (saving) return;
    setEditingSku(null);
    setForm(initialForm);
    setIsModalOpen(false);
  }

  const filteredInventory = inventoryRows.filter((row) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [row.sku, row.product, row.warehouse]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <AdminShell
      title="Inventario"
      subtitle="Stock por variante, alertas criticas y estado de reposicion."
    >
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Stock por SKU</h3>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar SKU o producto..."
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:w-64"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Agregar
            </button>
          </div>
        </div>
        {loading ? <p className="mt-4 text-sm text-zinc-500">Cargando...</p> : null}
        {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-2">SKU</th>
                <th className="py-2">Producto</th>
                <th className="py-2">On hand</th>
                <th className="py-2">Reservado</th>
                <th className="py-2">Disponible</th>
                <th className="py-2">Almacen</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((row) => {
                const available = row.onHand - row.reserved;
                return (
                  <tr key={row.sku} className="border-t border-zinc-100">
                    <td className="py-2 font-mono text-xs">{row.sku}</td>
                    <td className="py-2">{row.product}</td>
                    <td className="py-2">{row.onHand}</td>
                    <td className="py-2">{row.reserved}</td>
                    <td className={[
                      "py-2 font-semibold",
                      available <= 3 ? "text-red-700" : "text-zinc-900",
                    ].join(" ")}>
                      {available}
                    </td>
                    <td className="py-2">{row.warehouse}</td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="rounded-lg border border-zinc-300 px-2 py-1 text-xs font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.sku)}
                          className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <CrudModal
        isOpen={isModalOpen}
        title={editingSku ? `Editar SKU ${editingSku}` : "Registrar SKU"}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={form.sku}
            onChange={(event) => setForm((previous) => ({ ...previous, sku: event.target.value.toUpperCase() }))}
            placeholder="SKU"
            required
            disabled={Boolean(editingSku)}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100"
          />
          <input
            type="text"
            value={form.product}
            onChange={(event) => setForm((previous) => ({ ...previous, product: event.target.value }))}
            placeholder="Producto"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            value={form.onHand}
            onChange={(event) => setForm((previous) => ({ ...previous, onHand: Number(event.target.value) }))}
            placeholder="On hand"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            value={form.reserved}
            onChange={(event) => setForm((previous) => ({ ...previous, reserved: Number(event.target.value) }))}
            placeholder="Reservado"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={form.warehouse}
            onChange={(event) => setForm((previous) => ({ ...previous, warehouse: event.target.value }))}
            placeholder="Almacen"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:col-span-2"
          />
        </div>
      </CrudModal>
    </AdminShell>
  );
}
