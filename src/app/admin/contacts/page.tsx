"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminContact } from "@/lib/admin-data";

type ContactForm = Omit<AdminContact, "id">;

const initialForm: ContactForm = {
  name: "",
  channel: "WhatsApp",
  issue: "",
  priority: "Media",
  status: "Abierto",
};

export default function AdminContactsPage() {
  const [tickets, setTickets] = useState<AdminContact[]>([]);
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContacts() {
    const response = await fetch("/api/admin/contacts", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo cargar contactos.");
    }

    setTickets(payload.contacts || []);
  }

  useEffect(() => {
    fetchContacts()
      .catch((caughtError: unknown) => setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar contactos."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(editingId ? `/api/admin/contacts/${editingId}` : "/api/admin/contacts", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo guardar el contacto.");
      }

      await fetchContacts();
      setForm(initialForm);
      setEditingId(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el contacto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Eliminar este contacto?")) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo eliminar el contacto.");
      }

      await fetchContacts();
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
        setIsModalOpen(false);
      }
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar el contacto.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(contact: AdminContact) {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      channel: contact.channel,
      issue: contact.issue,
      priority: contact.priority,
      status: contact.status,
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

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [ticket.id, ticket.name, ticket.channel, ticket.issue, ticket.priority, ticket.status]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <AdminShell
      title="Contactos"
      subtitle="Bandeja unificada de consultas, soporte y oportunidades de venta."
    >
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Inbox de atencion</h3>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar contacto..."
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
        <ul className="mt-4 space-y-3">
          {filteredTickets.map((ticket) => (
            <li key={ticket.id} className="rounded-xl border border-zinc-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold">{ticket.id} · {ticket.name}</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold">{ticket.priority}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">{ticket.status}</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-zinc-700">{ticket.issue}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">Canal: {ticket.channel}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(ticket)}
                  className="rounded-lg border border-zinc-300 px-2 py-1 text-xs font-semibold"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(ticket.id)}
                  className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <CrudModal
        isOpen={isModalOpen}
        title={editingId ? `Editar contacto ${editingId}` : "Registrar contacto"}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
            placeholder="Nombre"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          />
          <select
            value={form.channel}
            onChange={(event) => setForm((previous) => ({ ...previous, channel: event.target.value as ContactForm["channel"] }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Formulario">Formulario</option>
          </select>
          <select
            value={form.priority}
            onChange={(event) => setForm((previous) => ({ ...previous, priority: event.target.value as ContactForm["priority"] }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <select
            value={form.status}
            onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value as ContactForm["status"] }))}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="Abierto">Abierto</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
          <input
            type="text"
            value={form.issue}
            onChange={(event) => setForm((previous) => ({ ...previous, issue: event.target.value }))}
            placeholder="Consulta"
            required
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:col-span-2"
          />
        </div>
      </CrudModal>
    </AdminShell>
  );
}
