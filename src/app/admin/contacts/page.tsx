"use client";

import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminContact } from "@/lib/admin-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

type ContactForm = Omit<AdminContact, "id" | "client">;

function buildClientName(form: ContactForm) {
  return [form.lastNamePaterno, form.lastNameMaterno, form.names]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

const initialForm: ContactForm = {
  documentType: "DNI",
  document: "",
  lastNamePaterno: "",
  lastNameMaterno: "",
  names: "",
  sex: "MASCULINO",
  birthDate: "",
  numero: "",
  cellphone: "",
  email: "",
  province: "",
  district: "",
  department: "",
  address: "",
  addressNumber: "",
  reference: "",
  agency: "",
  contactedBy: "",
};

export default function AdminContactsPage() {
  const [tickets, setTickets] = useState<AdminContact[]>([]);
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
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

    const client = buildClientName(form);

    try {
      const response = await fetch(editingId ? `/api/admin/contacts/${editingId}` : "/api/admin/contacts", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client }),
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
      await deleteContactById(id);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar el contacto.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteContactById(id: string) {
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
  }

  function handleEdit(contact: AdminContact) {
    setEditingId(contact.id);
    const { id: _id, client: _client, ...contactForm } = contact;
    setForm(contactForm);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function handleEditSelected() {
    if (selectedTicketIds.length !== 1) return;

    const contact = tickets.find((ticket) => ticket.id === selectedTicketIds[0]);
    if (!contact) return;

    handleEdit(contact);
  }

  async function handleDeleteSelected() {
    if (!selectedTicketIds.length) return;

    if (!window.confirm(`Eliminar ${selectedTicketIds.length} contacto(s)?`)) return;

    setSaving(true);
    setError(null);

    try {
      await Promise.all(selectedTicketIds.map((id) => deleteContactById(id)));
      setSelectedTicketIds([]);
    } finally {
      setSaving(false);
    }
  }

  function handleRowSelection(ticketId: string, event: ReactMouseEvent<HTMLLIElement>) {
    const withMultiSelect = event.ctrlKey || event.metaKey;

    if (withMultiSelect) {
      setSelectedTicketIds((previous) =>
        previous.includes(ticketId)
          ? previous.filter((id) => id !== ticketId)
          : [...previous, ticketId],
      );
      return;
    }

    setSelectedTicketIds([ticketId]);
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

    return [
      ticket.id,
      ticket.documentType,
      ticket.document,
      ticket.lastNamePaterno,
      ticket.lastNameMaterno,
      ticket.names,
      ticket.sex,
      ticket.birthDate,
      ticket.numero,
      ticket.client,
      ticket.cellphone,
      ticket.email,
      ticket.province,
      ticket.district,
      ticket.department,
      ticket.address,
      ticket.addressNumber,
      ticket.reference,
      ticket.agency,
      ticket.contactedBy,
    ]
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
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
              aria-label="Agregar contacto"
              title="Agregar contacto"
            >
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleEditSelected}
              disabled={selectedTicketIds.length !== 1}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl border transition",
                selectedTicketIds.length === 1
                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400",
              ].join(" ")}
              aria-label="Editar contacto seleccionado"
              title="Editar contacto"
            >
              <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={!selectedTicketIds.length}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-xl border transition",
                selectedTicketIds.length
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400",
              ].join(" ")}
              aria-label="Eliminar contacto seleccionado"
              title="Eliminar contacto"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar contacto..."
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:w-64"
            />
          </div>
          <h3 className="w-full text-lg font-bold">Inbox de atencion</h3>
        </div>
        {loading ? <p className="mt-4 text-sm text-zinc-500">Cargando...</p> : null}
        {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
        <ul className="mt-4 space-y-3">
          {filteredTickets.map((ticket) => (
            <li
              key={ticket.id}
              className={[
                "cursor-pointer rounded-xl border p-4 transition",
                selectedTicketIds.includes(ticket.id) ? "border-amber-200 bg-amber-50" : "border-zinc-200",
              ].join(" ")}
              onClick={(event) => handleRowSelection(ticket.id, event)}
              onDoubleClick={() => handleEdit(ticket)}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold">{ticket.id} · {ticket.client}</p>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold">{ticket.documentType}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-700">{ticket.document} · {ticket.cellphone} · {ticket.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                {ticket.department} / {ticket.province} / {ticket.district}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                DIRECCIÓN: {ticket.address} {ticket.addressNumber} · REFERENCIA: {ticket.reference}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                AGENCIA: {ticket.agency} · CONTACTADO POR: {ticket.contactedBy}
              </p>
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
        <div className="space-y-5">
          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Identificación</h4>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">TIPO DE DOCUMENTO</label>
                <select
                  value={form.documentType}
                  onChange={(event) => setForm((previous) => ({ ...previous, documentType: event.target.value as ContactForm["documentType"] }))}
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">PASAPORTE</option>
                  <option value="RUC">RUC</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DOCUMENTO</label>
                <input
                  type="text"
                  value={form.document}
                  onChange={(event) => setForm((previous) => ({ ...previous, document: event.target.value }))}
                  placeholder="DOCUMENTO"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">APELLIDO PATERNO</label>
                <input
                  type="text"
                  value={form.lastNamePaterno}
                  onChange={(event) => setForm((previous) => ({ ...previous, lastNamePaterno: event.target.value }))}
                  placeholder="APELLIDO PATERNO"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">APELLIDO MATERNO</label>
                <input
                  type="text"
                  value={form.lastNameMaterno}
                  onChange={(event) => setForm((previous) => ({ ...previous, lastNameMaterno: event.target.value }))}
                  placeholder="APELLIDO MATERNO"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5 xl:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">NOMBRES</label>
                <input
                  type="text"
                  value={form.names}
                  onChange={(event) => setForm((previous) => ({ ...previous, names: event.target.value }))}
                  placeholder="NOMBRES"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">SEXO</label>
                <select
                  value={form.sex}
                  onChange={(event) => setForm((previous) => ({ ...previous, sex: event.target.value as ContactForm["sex"] }))}
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                >
                  <option value="MASCULINO">MASCULINO</option>
                  <option value="FEMENINO">FEMENINO</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">NACIMIENTO</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(event) => setForm((previous) => ({ ...previous, birthDate: event.target.value }))}
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">NÚMERO</label>
                <input
                  type="text"
                  value={form.numero}
                  onChange={(event) => setForm((previous) => ({ ...previous, numero: event.target.value }))}
                  placeholder="NÚMERO"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2 xl:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">CLIENTE</label>
                <input
                  type="text"
                  value={buildClientName(form)}
                  readOnly
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-semibold uppercase text-zinc-700"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Ubicación</h4>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">PROVINCIA</label>
                <input
                  type="text"
                  value={form.province}
                  onChange={(event) => setForm((previous) => ({ ...previous, province: event.target.value }))}
                  placeholder="PROVINCIA"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DISTRITO</label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(event) => setForm((previous) => ({ ...previous, district: event.target.value }))}
                  placeholder="DISTRITO"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DEPARTAMENTO</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(event) => setForm((previous) => ({ ...previous, department: event.target.value }))}
                  placeholder="DEPARTAMENTO"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2 xl:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">DIRECCIÓN</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => setForm((previous) => ({ ...previous, address: event.target.value }))}
                  placeholder="DIRECCIÓN"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">NÚMERO</label>
                <input
                  type="text"
                  value={form.addressNumber}
                  onChange={(event) => setForm((previous) => ({ ...previous, addressNumber: event.target.value }))}
                  placeholder="NÚMERO"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2 xl:col-span-3">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">REFERENCIA</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(event) => setForm((previous) => ({ ...previous, reference: event.target.value }))}
                  placeholder="REFERENCIA"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">AGENCIA</label>
                <input
                  type="text"
                  value={form.agency}
                  onChange={(event) => setForm((previous) => ({ ...previous, agency: event.target.value }))}
                  placeholder="AGENCIA"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">CONTACTADO POR</label>
                <input
                  type="text"
                  value={form.contactedBy}
                  onChange={(event) => setForm((previous) => ({ ...previous, contactedBy: event.target.value }))}
                  placeholder="CONTACTADO POR"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Contacto</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">CELULAR</label>
                <input
                  type="text"
                  value={form.cellphone}
                  onChange={(event) => setForm((previous) => ({ ...previous, cellphone: event.target.value }))}
                  placeholder="CELULAR"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">EMAIL</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                  placeholder="EMAIL"
                  required
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm uppercase"
                />
              </div>
            </div>
          </section>
        </div>
      </CrudModal>
    </AdminShell>
  );
}
