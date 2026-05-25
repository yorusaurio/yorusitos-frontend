"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminOrder } from "@/lib/admin-data";

type OrderForm = Omit<AdminOrder, "id">;

const initialForm: OrderForm = {
  customer: "",
  total: 0,
  status: "Preparando",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo cargar pedidos.");
    }

    setOrders(payload.orders || []);
  }

  useEffect(() => {
    fetchOrders()
      .catch((caughtError: unknown) => setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar pedidos."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(editingId ? `/api/admin/orders/${editingId}` : "/api/admin/orders", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo guardar el pedido.");
      }

      await fetchOrders();
      setForm(initialForm);
      setEditingId(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el pedido.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Eliminar este pedido?")) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo eliminar el pedido.");
      }

      await fetchOrders();
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
        setIsModalOpen(false);
      }
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar el pedido.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(order: AdminOrder) {
    setEditingId(order.id);
    setForm({
      customer: order.customer,
      total: order.total,
      status: order.status,
    });
    setIsModalOpen(true);
  }

  function handleCreate() {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (saving) return;
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(false);
  }

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [order.id, order.customer, order.status]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <AdminShell
      title="Pedidos"
      subtitle="Vista operacional para empaquetado, despacho y seguimiento de ordenes."
    >
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Pipeline de pedidos</h3>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar pedido..."
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
                <th className="py-2">Pedido</th>
                <th className="py-2">Cliente</th>
                <th className="py-2">Total</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-zinc-100">
                  <td className="py-2 font-semibold">{order.id}</td>
                  <td className="py-2">{order.customer}</td>
                  <td className="py-2">S/ {order.total.toFixed(2)}</td>
                  <td className="py-2">{order.status}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(order)}
                        className="rounded-lg border border-zinc-300 px-2 py-1 text-xs font-semibold"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(order.id)}
                        className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CrudModal
        isOpen={isModalOpen}
        title={editingId ? `Editar pedido ${editingId}` : "Registrar pedido"}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={form.customer}
            onChange={(event) => setForm((previous) => ({ ...previous, customer: event.target.value }))}
            placeholder="Cliente"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.total}
            onChange={(event) => setForm((previous) => ({ ...previous, total: Number(event.target.value) }))}
            placeholder="Total"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />
          <select
            value={form.status}
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as OrderForm["status"] }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:col-span-2"
          >
            <option value="Preparando">Preparando</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
            <option value="Pendiente de pago">Pendiente de pago</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </CrudModal>
    </AdminShell>
  );
}
