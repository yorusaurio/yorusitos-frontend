"use client";

import { FormEvent, MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import SaleModal from "@/components/admin/SaleModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import type { AdminSale } from "@/lib/admin-data";

type SaleForm = Omit<AdminSale, "id">;

const initialForm: SaleForm = {
  orderNumber: "",
  placedAt: new Date().toISOString().slice(0, 10),
  customerId: "",
  customerDni: "",
  customerAddress: "",
  channel: "online",
  customer: "",
  customerType: "MINORISTA",
  currency: "SOLES",
  exchangeRate: 1,
  subtotal: 0,
  discountTotal: 0,
  shippingTotal: 0,
  taxTotal: 0,
  amount: 0,
  paymentStatus: "Pendiente",
  status: "Pendiente",
  source: "web",
  notes: "",
  salesRepId: "",
};

export default function AdminSalesPage() {
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [form, setForm] = useState<SaleForm>(initialForm);
  const [baselineForm, setBaselineForm] = useState<SaleForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSaleIds, setSelectedSaleIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isSaleFilterOpen, setIsSaleFilterOpen] = useState(false);
  const [saleFilterSearch, setSaleFilterSearch] = useState("");
  const [selectedSaleFilters, setSelectedSaleFilters] = useState<string[]>([]);
  const [isChannelFilterOpen, setIsChannelFilterOpen] = useState(false);
  const [channelFilterSearch, setChannelFilterSearch] = useState("");
  const [selectedChannelFilters, setSelectedChannelFilters] = useState<string[]>([]);
  const [isCustomerFilterOpen, setIsCustomerFilterOpen] = useState(false);
  const [customerFilterSearch, setCustomerFilterSearch] = useState("");
  const [selectedCustomerFilters, setSelectedCustomerFilters] = useState<string[]>([]);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [statusFilterSearch, setStatusFilterSearch] = useState("");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<string[]>([]);
  const [isAmountFilterOpen, setIsAmountFilterOpen] = useState(false);
  const [amountFilterMin, setAmountFilterMin] = useState("");
  const [amountFilterMax, setAmountFilterMax] = useState("");
  const [sellerName, setSellerName] = useState("Vendedor actual");
  const [sellerId, setSellerId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saleFilterRef = useRef<HTMLDivElement | null>(null);
  const channelFilterRef = useRef<HTMLDivElement | null>(null);
  const customerFilterRef = useRef<HTMLDivElement | null>(null);
  const statusFilterRef = useRef<HTMLDivElement | null>(null);
  const amountFilterRef = useRef<HTMLDivElement | null>(null);

  async function fetchSales() {
    const response = await fetch("/api/admin/sales", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo cargar ventas.");
    }

    setSales(payload.sales || []);
  }

  useEffect(() => {
    fetchSales()
      .catch((caughtError: unknown) => setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar ventas."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) return;

        if (payload?.user) {
          setSellerName(payload.user.displayName || `${payload.user.firstName || ""} ${payload.user.lastName || ""}`.trim() || "Vendedor actual");
          setSellerId(payload.user.id || "");
        }
      } catch {
        // Keep fallback labels when auth is unavailable.
      }
    }

    fetchCurrentUser();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(editingId ? `/api/admin/sales/${editingId}` : "/api/admin/sales", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          orderNumber: form.orderNumber || editingId || undefined,
          placedAt: form.placedAt,
          customerId: form.customerId || undefined,
          customerDni: form.customerDni || undefined,
          customerAddress: form.customerAddress || undefined,
          customerType: form.customerType,
          amount: computedSaleAmount,
          exchangeRate: form.exchangeRate,
          salesRepId: form.salesRepId || sellerId || undefined,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo guardar la venta.");
      }

      await fetchSales();
      const resetForm = { ...initialForm, salesRepId: sellerId };
      setForm(resetForm);
      setBaselineForm(resetForm);
      setEditingId(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar la venta.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSaleById(id: string) {
    const response = await fetch(`/api/admin/sales/${id}`, { method: "DELETE" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "No se pudo eliminar la venta.");
    }
  }

  function handleEdit(sale: AdminSale) {
    const nextForm: SaleForm = {
      orderNumber: sale.orderNumber || sale.id,
      placedAt: sale.placedAt || new Date().toISOString().slice(0, 10),
      customerId: sale.customerId || "",
      customerDni: sale.customerDni || "",
      customerAddress: sale.customerAddress || "",
      channel: sale.channel,
      customer: sale.customer,
      customerType: sale.customerType || "MINORISTA",
      currency: sale.currency || "SOLES",
      exchangeRate: sale.exchangeRate || 1,
      subtotal: sale.subtotal ?? 0,
      discountTotal: sale.discountTotal ?? 0,
      shippingTotal: sale.shippingTotal ?? 0,
      taxTotal: sale.taxTotal ?? 0,
      amount: sale.amount,
      paymentStatus: sale.paymentStatus || "Pendiente",
      status: sale.status,
      source: sale.source || "web",
      notes: sale.notes || "",
      salesRepId: sale.salesRepId || sellerId,
    };

    console.log("handleEdit -> opening modal for", sale.id);
    setEditingId(sale.id);
    setForm(nextForm);
    setBaselineForm(nextForm);
    setIsModalOpen(true);
  }

  function handleCreate() {
    console.log("handleCreate -> opening modal (new sale)");
    setEditingId(null);
    const nextForm = { ...initialForm, salesRepId: sellerId };
    setForm(nextForm);
    setBaselineForm(nextForm);
    setIsModalOpen(true);
  }

  function handleEditSelected() {
    if (selectedSaleIds.length !== 1) return;
    const sale = sales.find((item) => item.id === selectedSaleIds[0]);
    if (!sale) return;
    handleEdit(sale);
  }
  async function handleDeleteSelected() {
    if (!selectedSaleIds.length) return;

    if (!window.confirm(`Eliminar ${selectedSaleIds.length} venta(s)?`)) return;

    setSaving(true);
    setError(null);

    try {
      await Promise.all(selectedSaleIds.map((id) => deleteSaleById(id)));
      await fetchSales();
      setSelectedSaleIds([]);

      if (editingId && selectedSaleIds.includes(editingId)) {
        setEditingId(null);
        setForm(initialForm);
        setIsModalOpen(false);
      }
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo eliminar la venta.");
    } finally {
      setSaving(false);
    }
  }

  function handleRowSelection(saleId: string, event: ReactMouseEvent<HTMLTableRowElement>) {
    const withMultiSelect = event.ctrlKey || event.metaKey;

    if (withMultiSelect) {
      setSelectedSaleIds((previous) =>
        previous.includes(saleId)
          ? previous.filter((id) => id !== saleId)
          : [...previous, saleId],
      );
      return;
    }

    setSelectedSaleIds([saleId]);
  }

  function toggleSaleFilter(saleId: string) {
    setSelectedSaleFilters((previous) =>
      previous.includes(saleId)
        ? previous.filter((id) => id !== saleId)
        : [...previous, saleId],
    );
  }

  function toggleChannelFilter(channel: string) {
    setSelectedChannelFilters((previous) =>
      previous.includes(channel)
        ? previous.filter((item) => item !== channel)
        : [...previous, channel],
    );
  }

  function toggleCustomerFilter(customer: string) {
    setSelectedCustomerFilters((previous) =>
      previous.includes(customer)
        ? previous.filter((item) => item !== customer)
        : [...previous, customer],
    );
  }

  function toggleStatusFilter(status: string) {
    setSelectedStatusFilters((previous) =>
      previous.includes(status)
        ? previous.filter((item) => item !== status)
        : [...previous, status],
    );
  }

  function clearSaleFilter() {
    setSelectedSaleFilters([]);
    setSaleFilterSearch("");
  }

  function clearChannelFilter() {
    setSelectedChannelFilters([]);
    setChannelFilterSearch("");
  }

  function clearCustomerFilter() {
    setSelectedCustomerFilters([]);
    setCustomerFilterSearch("");
  }

  function clearStatusFilter() {
    setSelectedStatusFilters([]);
    setStatusFilterSearch("");
  }

  function clearAmountFilter() {
    setAmountFilterMin("");
    setAmountFilterMax("");
  }

  const canEditSelected = selectedSaleIds.length === 1;
  const canDeleteSelected = selectedSaleIds.length > 0;

  function handleCloseModal() {
    if (saving) return;
    setEditingId(null);
    setForm({ ...initialForm, salesRepId: sellerId });
    setIsModalOpen(false);
  }

  useEffect(() => {
    console.log("isModalOpen changed:", isModalOpen);
  }, [isModalOpen]);

  // Allow opening the modal via query string for debugging/testing: ?openSaleModal=true
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("openSaleModal") === "true") {
        setIsModalOpen(true);
      }
    } catch {
      // ignore when window is not available or parsing fails
    }
  }, []);

  function parseMoneyInput(value: string) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function calculateAmount(nextForm: SaleForm) {
    return Math.max(0, (nextForm.subtotal || 0) - (nextForm.discountTotal || 0) + (nextForm.shippingTotal || 0) + (nextForm.taxTotal || 0));
  }

  function updateMoneyField(field: "subtotal" | "discountTotal" | "shippingTotal" | "taxTotal", value: string) {
    setForm((previous) => {
      const nextForm = {
        ...previous,
        [field]: parseMoneyInput(value),
      } as SaleForm;

      return {
        ...nextForm,
        amount: calculateAmount(nextForm),
      };
    });
  }

  const saleFilterOptions = useMemo(
    () => Array.from(new Set(sales.map((sale) => sale.id))),
    [sales],
  );

  const channelFilterOptions = useMemo(
    () => Array.from(new Set(sales.map((sale) => sale.channel))),
    [sales],
  );

  const customerFilterOptions = useMemo(
    () => Array.from(new Set(sales.map((sale) => sale.customer).filter(Boolean))),
    [sales],
  );

  const statusFilterOptions = useMemo(
    () => Array.from(new Set(sales.map((sale) => sale.status))),
    [sales],
  );

  const visibleSaleFilterOptions = useMemo(() => {
    const query = saleFilterSearch.trim().toLowerCase();
    if (!query) return saleFilterOptions;

    return saleFilterOptions.filter((saleId) => saleId.toLowerCase().includes(query));
  }, [saleFilterOptions, saleFilterSearch]);

  const visibleChannelFilterOptions = useMemo(() => {
    const query = channelFilterSearch.trim().toLowerCase();
    if (!query) return channelFilterOptions;

    return channelFilterOptions.filter((channel) => channel.toLowerCase().includes(query));
  }, [channelFilterOptions, channelFilterSearch]);

  const visibleCustomerFilterOptions = useMemo(() => {
    const query = customerFilterSearch.trim().toLowerCase();
    if (!query) return customerFilterOptions;

    return customerFilterOptions.filter((customer) => customer.toLowerCase().includes(query));
  }, [customerFilterOptions, customerFilterSearch]);

  const visibleStatusFilterOptions = useMemo(() => {
    const query = statusFilterSearch.trim().toLowerCase();
    if (!query) return statusFilterOptions;

    return statusFilterOptions.filter((status) => status.toLowerCase().includes(query));
  }, [statusFilterOptions, statusFilterSearch]);

  const parsedAmountMin = amountFilterMin.trim() === "" ? null : Number(amountFilterMin);
  const parsedAmountMax = amountFilterMax.trim() === "" ? null : Number(amountFilterMax);
  const computedSaleAmount = calculateAmount(form);

  const filteredSales = sales.filter((sale) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [sale.id, sale.customer, sale.channel, sale.status]
      .join(" ")
      .toLowerCase()
      .includes(query);

    const matchesSaleFilter = selectedSaleFilters.length === 0 || selectedSaleFilters.includes(sale.id);
    const matchesChannelFilter = selectedChannelFilters.length === 0 || selectedChannelFilters.includes(sale.channel);
    const matchesCustomerFilter = selectedCustomerFilters.length === 0 || selectedCustomerFilters.includes(sale.customer);
    const matchesStatusFilter = selectedStatusFilters.length === 0 || selectedStatusFilters.includes(sale.status);
    const matchesAmountFilter =
      (parsedAmountMin === null || Number.isNaN(parsedAmountMin) || sale.amount >= parsedAmountMin) &&
      (parsedAmountMax === null || Number.isNaN(parsedAmountMax) || sale.amount <= parsedAmountMax);

    return matchesSearch && matchesSaleFilter && matchesChannelFilter && matchesCustomerFilter && matchesStatusFilter && matchesAmountFilter;
  });

  const liveAmount = Number.isFinite(form.amount) ? form.amount.toFixed(2) : "0.00";

  const keptFields = [
    { label: "channel", value: "Se queda" },
    { label: "customer", value: "Nombre completo del cliente" },
    { label: "amount", value: `Monto total: S/ ${liveAmount}` },
    { label: "status", value: "Se queda" },
  ];

  const targetOrderFields = [
    "id",
    "order_number",
    "customer_id",
    "channel",
    "status",
    "fulfillment_status",
    "payment_status",
    "currency",
    "subtotal",
    "discount_total",
    "shipping_total",
    "tax_total",
    "total",
    "billing_address_id",
    "shipping_address_id",
    "sales_rep_id",
    "source",
    "notes",
    "placed_at",
    "created_at",
    "updated_at",
    "deleted_at",
  ];

  const fieldsToAddLater = [
    "order_number: se genera automáticamente en el primer guardado",
    "customer_id: id del cliente ya creado",
    "currency: SOLES o DOLARES",
    "subtotal: monto sin IGV",
    "discount_total: descuento total aplicado",
    "shipping_total: costo de envio",
    "tax_total: total del IGV",
    "billing_address_id: direccion de facturacion (pendiente de definir)",
    "shipping_address_id: id del envio / distrito y direccion del cliente",
    "sales_rep_id: id del vendedor",
    "fulfillment_status: estado de preparacion",
    "payment_status: estado de pago",
    "source: web, instagram, whatsapp, store",
    "notes: notas internas",
    "placed_at: fecha de registro",
    "created_at",
    "updated_at",
    "deleted_at",
  ];

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
    visibleOptions: string[],
  ) {
    return (
      <div className="relative inline-block" ref={filterRef}>
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-zinc-600 transition hover:bg-zinc-100"
          title={`Filtrar por ${label.toLowerCase()}`}
        >
          <span>{label}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={["h-3 w-3 transition", isOpen ? "rotate-180" : ""].join(" ")}
          />
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
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(value)}
                      onChange={() => toggleValue(value)}
                      className="h-3.5 w-3.5 rounded border-zinc-300"
                    />
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

  function renderAmountFilter() {
    return (
      <div className="relative inline-block" ref={amountFilterRef}>
        <button
          type="button"
          onClick={() => setIsAmountFilterOpen((previous) => !previous)}
          className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-zinc-600 transition hover:bg-zinc-100"
          title="Filtrar por monto"
        >
          <span>Monto</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={["h-3 w-3 transition", isAmountFilterOpen ? "rotate-180" : ""].join(" ")}
          />
        </button>

        {isAmountFilterOpen ? (
          <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Mínimo</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountFilterMin}
                  onChange={(event) => setAmountFilterMin(event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-300 px-2.5 py-2 text-xs text-zinc-800"
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Máximo</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountFilterMax}
                  onChange={(event) => setAmountFilterMax(event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-300 px-2.5 py-2 text-xs text-zinc-800"
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={clearAmountFilter}
                className="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setIsAmountFilterOpen(false)}
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

  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(baselineForm);

  return (
    <AdminShell
      title="Ventas"
      subtitle="Control de ventas por canal, estado de pago y rendimiento comercial."
    >
      <section className="mt-6 min-h-[36rem] overflow-visible rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Ultimas transacciones</h3>
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreate}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                aria-label="Agregar venta"
                title="Agregar venta"
              >
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleEditSelected}
                disabled={!canEditSelected}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl border transition",
                  canEditSelected
                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400",
                ].join(" ")}
                aria-label="Editar venta seleccionada"
                title="Editar venta"
              >
                <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={!canDeleteSelected}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl border transition",
                  canDeleteSelected
                    ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400",
                ].join(" ")}
                aria-label="Eliminar venta seleccionada"
                title="Eliminar venta"
              >
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
              </button>
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar venta..."
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm sm:w-72"
            />
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
                    "Venta",
                    isSaleFilterOpen,
                    setIsSaleFilterOpen,
                    saleFilterRef,
                    saleFilterSearch,
                    setSaleFilterSearch,
                    selectedSaleFilters,
                    toggleSaleFilter,
                    clearSaleFilter,
                    saleFilterOptions,
                    visibleSaleFilterOptions,
                  )}
                </th>
                <th className="py-2">
                  {renderHeaderFilter(
                    "Canal",
                    isChannelFilterOpen,
                    setIsChannelFilterOpen,
                    channelFilterRef,
                    channelFilterSearch,
                    setChannelFilterSearch,
                    selectedChannelFilters,
                    toggleChannelFilter,
                    clearChannelFilter,
                    channelFilterOptions,
                    visibleChannelFilterOptions,
                  )}
                </th>
                <th className="py-2">
                  {renderHeaderFilter(
                    "Cliente",
                    isCustomerFilterOpen,
                    setIsCustomerFilterOpen,
                    customerFilterRef,
                    customerFilterSearch,
                    setCustomerFilterSearch,
                    selectedCustomerFilters,
                    toggleCustomerFilter,
                    clearCustomerFilter,
                    customerFilterOptions,
                    visibleCustomerFilterOptions,
                  )}
                </th>
                <th className="py-2">{renderAmountFilter()}</th>
                <th className="py-2">
                  {renderHeaderFilter(
                    "Estado",
                    isStatusFilterOpen,
                    setIsStatusFilterOpen,
                    statusFilterRef,
                    statusFilterSearch,
                    setStatusFilterSearch,
                    selectedStatusFilters,
                    toggleStatusFilter,
                    clearStatusFilter,
                    statusFilterOptions,
                    visibleStatusFilterOptions,
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className={[
                    "cursor-pointer border-t border-zinc-100",
                    selectedSaleIds.includes(sale.id) ? "bg-amber-50" : "",
                  ].join(" ")}
                  onClick={(event) => handleRowSelection(sale.id, event)}
                  onDoubleClick={() => handleEdit(sale)}
                >
                  <td className="py-2 font-semibold">{sale.id}</td>
                  <td className="py-2 uppercase">{sale.channel}</td>
                  <td className="py-2">{sale.customer}</td>
                  <td className="py-2">S/ {sale.amount.toFixed(2)}</td>
                  <td className="py-2">
                    <span className={[
                      "rounded-full px-2 py-1 text-xs font-bold",
                      sale.status === "Pagado"
                        ? "bg-emerald-100 text-emerald-800"
                        : sale.status === "Pendiente"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-200 text-zinc-700",
                    ].join(" ")}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SaleModal
        isOpen={isModalOpen}
        title={editingId ? `Editar venta ${editingId}` : "Registrar venta"}
        saving={saving}
        hasUnsavedChanges={hasUnsavedChanges}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        sellerName={sellerName}
        editingId={editingId}
        updateMoneyField={updateMoneyField}
        computedSaleAmount={computedSaleAmount}
      />
    </AdminShell>
  );
}
