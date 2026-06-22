"use client";

import { MouseEvent as ReactMouseEvent, useMemo, useEffect, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ContactModal from "@/components/admin/ContactModal";
import type { AdminContact } from "@/lib/admin-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AdminContactsPage() {
  const [tickets, setTickets] = useState<AdminContact[]>([]);
  const [editingContact, setEditingContact] = useState<AdminContact | null>(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContactFilterOpen, setIsContactFilterOpen] = useState(false);
  const [contactFilterSearch, setContactFilterSearch] = useState("");
  const [selectedContactFilters, setSelectedContactFilters] = useState<string[]>([]);
  const [isClientFilterOpen, setIsClientFilterOpen] = useState(false);
  const [clientFilterSearch, setClientFilterSearch] = useState("");
  const [selectedClientFilters, setSelectedClientFilters] = useState<string[]>([]);
  const [isDocumentFilterOpen, setIsDocumentFilterOpen] = useState(false);
  const [documentFilterSearch, setDocumentFilterSearch] = useState("");
  const [selectedDocumentFilters, setSelectedDocumentFilters] = useState<string[]>([]);
  const [isNumberFilterOpen, setIsNumberFilterOpen] = useState(false);
  const [numberFilterSearch, setNumberFilterSearch] = useState("");
  const [selectedNumberFilters, setSelectedNumberFilters] = useState<string[]>([]);
  const contactFilterRef = useRef<HTMLDivElement | null>(null);
  const clientFilterRef = useRef<HTMLDivElement | null>(null);
  const documentFilterRef = useRef<HTMLDivElement | null>(null);
  const numberFilterRef = useRef<HTMLDivElement | null>(null);

  const contactFilterOptions = useMemo(() => {
    const collected = tickets.flatMap((ticket) => {
      const sourceValues = Array.isArray(ticket.contactedBy) ? ticket.contactedBy : [];
      return ticket.contactedByOther ? [...sourceValues, ticket.contactedByOther] : sourceValues;
    });

    return Array.from(new Set(collected.filter(Boolean))).sort((left, right) => left.localeCompare(right, "es"));
  }, [tickets]);
  const clientFilterOptions = useMemo(
    () => Array.from(new Set(tickets.map((ticket) => ticket.client).filter(Boolean))).sort((left, right) => left.localeCompare(right, "es")),
    [tickets],
  );
  const documentFilterOptions = useMemo(
    () => Array.from(new Set(tickets.map((ticket) => ticket.document).filter(Boolean))).sort((left, right) => left.localeCompare(right, "es")),
    [tickets],
  );
  const numberFilterOptions = useMemo(
    () => Array.from(new Set(tickets.map((ticket) => ticket.cellphone).filter(Boolean))).sort((left, right) => left.localeCompare(right, "es")),
    [tickets],
  );

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

  async function handleSubmitContact(payload: Omit<AdminContact, "id">, editingId: string | null) {
    setSaving(true);
    setError(null);

    // Debug log: show payload and editingId when sending to API
    // eslint-disable-next-line no-console
    console.log("AdminContactsPage: sending payload", { editingId, payload });

    try {
      const response = await fetch(editingId ? `/api/admin/contacts/${editingId}` : "/api/admin/contacts", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      // Debug log: server response
      // eslint-disable-next-line no-console
      console.log("AdminContactsPage: server response", { status: response.status, ok: response.ok, body });

      if (!response.ok) {
        throw new Error(body.error || "No se pudo guardar el contacto.");
      }

      await fetchContacts();
      setEditingContact(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el contacto.");
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
    if (editingContact?.id === id) {
      setEditingContact(null);
      setIsModalOpen(false);
    }
  }

  function handleEdit(contact: AdminContact) {
    setEditingContact(contact);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setEditingContact(null);
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
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar el contacto.");
    } finally {
      setSaving(false);
    }
  }

  function handleRowSelection(ticketId: string, event: React.MouseEvent<HTMLElement>) {
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
    setEditingContact(null);
    setIsModalOpen(false);
  }

  function toggleContactFilter(value: string) {
    setSelectedContactFilters((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  }

  function clearContactFilter() {
    setSelectedContactFilters([]);
    setContactFilterSearch("");
  }

  function toggleClientFilter(value: string) {
    setSelectedClientFilters((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  }

  function clearClientFilter() {
    setSelectedClientFilters([]);
    setClientFilterSearch("");
  }

  function toggleDocumentFilter(value: string) {
    setSelectedDocumentFilters((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  }

  function clearDocumentFilter() {
    setSelectedDocumentFilters([]);
    setDocumentFilterSearch("");
  }

  function toggleNumberFilter(value: string) {
    setSelectedNumberFilters((previous) =>
      previous.includes(value) ? previous.filter((item) => item !== value) : [...previous, value],
    );
  }

  function clearNumberFilter() {
    setSelectedNumberFilters([]);
    setNumberFilterSearch("");
  }

  function renderHeaderFilter(
    label: string,
    isOpen: boolean,
    setOpen: (value: boolean | ((previous: boolean) => boolean)) => void,
    filterRef: React.RefObject<HTMLDivElement | null>,
    searchValue: string,
    setSearchValue: (value: string) => void,
    selectedValues: string[],
    toggleValue: (value: string) => void,
    clearValue: () => void,
    options: string[],
  ) {
    const visibleOptions = options.filter((option) => option.toLowerCase().includes(searchValue.trim().toLowerCase()));

    return (
      <div className="relative inline-block" ref={filterRef}>
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-zinc-600 transition hover:bg-zinc-100"
          title={`Filtrar por ${label.toLowerCase()}`}
        >
          <span>{label}</span>
          <FontAwesomeIcon icon={faChevronDown} className={["h-3 w-3 transition", isOpen ? "rotate-180" : ""].join(" ")} />
        </button>

        {isOpen ? (
          <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={`Buscar ${label.toLowerCase()}...`}
              className="w-full rounded-lg border border-zinc-300 px-2.5 py-2 text-xs text-zinc-800"
            />

            <div className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1">
              {visibleOptions.length ? (
                visibleOptions.map((value) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100">
                    <input type="checkbox" checked={selectedValues.includes(value)} onChange={() => toggleValue(value)} className="h-3.5 w-3.5 rounded border-zinc-300" />
                    <span className="font-medium text-zinc-800">{value}</span>
                  </label>
                ))
              ) : (
                <p className="px-1.5 py-2 text-xs text-zinc-500">Sin resultados</p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={clearValue}
                className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Aplicar
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const contactText = Array.isArray(ticket.contactedBy) ? ticket.contactedBy.join(" ") : String(ticket.contactedBy || "");
      const matchesSearch = !query || [
        ticket.id,
        ticket.documentType,
        ticket.document,
        ticket.lastNamePaterno,
        ticket.lastNameMaterno,
        ticket.names,
        ticket.sex,
        ticket.birthDate,
        ticket.numero,
        ticket.classification,
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
        contactText,
        ticket.contactedByOther,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesContactFilter =
        selectedContactFilters.length === 0 ||
        selectedContactFilters.some((filter) => ticket.contactedBy.includes(filter) || ticket.contactedByOther?.toUpperCase() === filter);

      const matchesClientFilter =
        selectedClientFilters.length === 0 ||
        selectedClientFilters.includes(ticket.client);

      const matchesDocumentFilter =
        selectedDocumentFilters.length === 0 ||
        selectedDocumentFilters.includes(ticket.document);

      const matchesNumberFilter =
        selectedNumberFilters.length === 0 ||
        selectedNumberFilters.includes(ticket.cellphone);

      return matchesSearch && matchesContactFilter && matchesClientFilter && matchesDocumentFilter && matchesNumberFilter;
    });
  }, [
    tickets,
    search,
    selectedContactFilters,
    selectedClientFilters,
    selectedDocumentFilters,
    selectedNumberFilters,
  ]);

  return (
    <AdminShell
      title="Contactos"
      subtitle="Bandeja unificada de consultas, soporte y oportunidades de venta."
    >
      <section className="mt-6 min-h-[36rem] overflow-visible rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Contactos recientes</h3>
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            <div className="flex items-center gap-2">
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
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:w-72"
              />
            </div>
          </div>
        </div>

        {loading ? <p className="mt-4 text-sm text-zinc-500">Cargando...</p> : null}
        {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}

        <div className="mt-4 overflow-visible">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-2">
                  {renderHeaderFilter(
                    "CLIENTE",
                    isClientFilterOpen,
                    setIsClientFilterOpen,
                    clientFilterRef,
                    clientFilterSearch,
                    setClientFilterSearch,
                    selectedClientFilters,
                    toggleClientFilter,
                    clearClientFilter,
                    clientFilterOptions,
                  )}
                </th>
                <th className="py-2">
                  {renderHeaderFilter(
                    "DOCUMENTO",
                    isDocumentFilterOpen,
                    setIsDocumentFilterOpen,
                    documentFilterRef,
                    documentFilterSearch,
                    setDocumentFilterSearch,
                    selectedDocumentFilters,
                    toggleDocumentFilter,
                    clearDocumentFilter,
                    documentFilterOptions,
                  )}
                </th>
                <th className="py-2">
                  {renderHeaderFilter(
                    "NUMERO",
                    isNumberFilterOpen,
                    setIsNumberFilterOpen,
                    numberFilterRef,
                    numberFilterSearch,
                    setNumberFilterSearch,
                    selectedNumberFilters,
                    toggleNumberFilter,
                    clearNumberFilter,
                    numberFilterOptions,
                  )}
                </th>
                <th className="py-2">
                  {renderHeaderFilter(
                    "CONTACTADO POR",
                    isContactFilterOpen,
                    setIsContactFilterOpen,
                    contactFilterRef,
                    contactFilterSearch,
                    setContactFilterSearch,
                    selectedContactFilters,
                    toggleContactFilter,
                    clearContactFilter,
                    contactFilterOptions,
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className={[
                    "cursor-pointer border-t border-zinc-100",
                    selectedTicketIds.includes(ticket.id) ? "bg-amber-50" : "",
                  ].join(" ")}
                  onClick={(event) => handleRowSelection(ticket.id, event)}
                  onDoubleClick={() => handleEdit(ticket)}
                >
                  <td className="py-4 pr-4 align-top font-semibold text-zinc-900">{ticket.client}</td>
                  <td className="py-4 pr-4 align-top text-zinc-600">{ticket.document}</td>
                  <td className="py-4 pr-4 align-top text-zinc-600">{ticket.cellphone}</td>
                  <td className="py-4 pr-4 align-top text-zinc-600">
                    {Array.isArray(ticket.contactedBy) ? ticket.contactedBy.join(", ") : ticket.contactedBy}
                    {ticket.contactedByOther ? ` (${ticket.contactedByOther})` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ContactModal
        isOpen={isModalOpen}
        saving={saving}
        editingContact={editingContact}
        onClose={handleCloseModal}
        onSubmitContact={handleSubmitContact}
      />
    </AdminShell>
  );
}

