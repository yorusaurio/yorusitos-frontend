"use client";

import { FormEvent, Fragment, MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { faBoxOpen, faChevronLeft, faChevronRight, faFilePdf, faLayerGroup, faPen, faPlus, faRotate, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminShell from "@/components/admin/AdminShell";
import CrudModal from "@/components/admin/CrudModal";
import type { AdminInventoryItem, AdminInventoryProduct, AdminInventoryProductInput } from "@/lib/admin-data";
import type { CatalogFormat, CatalogOptions, CatalogPriceMode } from "@/components/admin/CatalogGeneratorModal";

const CatalogGeneratorModal = dynamic(() => import("@/components/admin/CatalogGeneratorModal"), {
  ssr: false,
});

type InventoryForm = AdminInventoryItem;
type StockFilter = "all" | "low" | "out" | "available";
type ProductEditorForm = AdminInventoryProductInput;

const initialForm: InventoryForm = {
  sku: "",
  parentSku: "",
  productId: undefined,
  product: "",
  description: "",
  category: "Polo",
  collection: "",
  color: "",
  size: "",
  options: {},
  price: 0,
  image: "",
  onHand: 0,
  reserved: 0,
  sold: 0,
  lowStockThreshold: 3,
  status: "active",
  warehouse: "Principal",
};
const initialProductForm: ProductEditorForm = {
  product: "",
  description: "",
  category: "Polo",
  collection: "",
  image: "",
  basePrice: 35,
  colors: ["Blanco", "Negro"],
  sizes: ["S", "M", "L"],
  sizePrices: {
    S: 35,
    M: 35,
    L: 35,
  },
  sizeStocks: {
    S: 10,
    M: 10,
    L: 10,
  },
  defaultStock: 10,
  lowStockThreshold: 3,
  status: "active",
  warehouse: "Principal",
};

const itemsPerPage = 25;
const inputClass = "rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-500";
const productTypes = ["Polo", "Polera", "Hoodie", "Pantalon", "Short", "Gorra", "Accesorio"];
const collectionOptions = ["SuperStars", "Romantic", "GYM", "Basicos", "Edicion limitada"];
const colorOptions = [
  { name: "Blanco", className: "bg-white ring-1 ring-zinc-300" },
  { name: "Negro", className: "bg-zinc-950" },
  { name: "Melange", className: "bg-zinc-300" },
  { name: "Rojo", className: "bg-red-600" },
  { name: "Azul", className: "bg-blue-600" },
  { name: "Verde", className: "bg-emerald-600" },
  { name: "Rosa", className: "bg-pink-400" },
];
const sizeOptions = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "STD"];
const initialCatalogOptions: CatalogOptions = {
  collection: "all",
  category: "all",
  includeOutOfStock: false,
  priceMode: "retail",
  wholesaleDiscount: 0,
  format: "social-horizontal",
  includeSku: false,
  includeVariants: true,
  previewReady: false,
};

export default function AdminInventoryPage() {
  const [inventoryRows, setInventoryRows] = useState<AdminInventoryItem[]>([]);
  const [inventoryProducts, setInventoryProducts] = useState<AdminInventoryProduct[]>([]);
  const [form, setForm] = useState<InventoryForm>(initialForm);
  const [productForm, setProductForm] = useState<ProductEditorForm>(initialProductForm);
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editingParentSku, setEditingParentSku] = useState<string | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogOptions, setCatalogOptions] = useState<CatalogOptions>(initialCatalogOptions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchInventory() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/inventory", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "No se pudo cargar inventario.");
      }

      setInventoryRows(payload.inventory || []);
      setInventoryProducts(payload.products || []);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo cargar inventario.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, collectionFilter, statusFilter, stockFilter]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const endpoint = editingSku ? `/api/admin/inventory/${editingSku}` : "/api/admin/inventory";
      const payload = editingSku
        ? {
            productId: form.productId,
            parentSku: form.parentSku,
            product: form.product,
            description: form.description,
            category: form.category,
            collection: form.collection,
            color: form.color,
            size: form.size,
            options: form.options,
            price: form.price,
            image: form.image,
            onHand: form.onHand,
            reserved: form.reserved,
            sold: form.sold,
            lowStockThreshold: form.lowStockThreshold,
            status: form.status,
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
      setSelectedSku(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el SKU.");
    } finally {
      setSaving(false);
    }
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/inventory/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "No se pudo guardar el producto.");
      }

      await fetchInventory();
      setProductForm(initialProductForm);
      setEditingParentSku(null);
      setEditingSku(null);
      setSelectedSku(null);
      setIsModalOpen(false);
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el producto.");
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
    const product = inventoryProducts.find((item) => item.parentSku === row.parentSku || item.variants.some((variant) => variant.sku === row.sku));
    if (product) handleEditProduct(product);
  }

  function handleCreate() {
    setEditingSku(null);
    setEditingParentSku(null);
    setProductForm(initialProductForm);
    setIsModalOpen(true);
  }

  function handleEditProduct(product: AdminInventoryProduct) {
    const colors = Array.from(new Set(product.variants.map((variant) => variant.color || "UNICO")));
    const sizes = Array.from(new Set(product.variants.map((variant) => variant.size || "STD")));
    const sizePrices = Object.fromEntries(
      sizes.map((size) => {
        const variant = product.variants.find((item) => (item.size || "STD") === size);
        return [size, variant?.price ?? product.basePrice ?? 0];
      })
    );
    const sizeStocks = Object.fromEntries(
      sizes.map((size) => {
        const variants = product.variants.filter((item) => (item.size || "STD") === size);
        return [size, variants.length ? Math.max(...variants.map((variant) => variant.onHand)) : 0];
      })
    );
    const firstVariant = product.variants[0];

    setEditingParentSku(product.parentSku);
    setProductForm({
      productId: product.productId,
      parentSku: product.parentSku,
      product: product.product,
      description: product.description || firstVariant?.description || "",
      category: product.category || firstVariant?.category || "Polo",
      collection: product.collection || "",
      image: product.images[0] || firstVariant?.image || "",
      basePrice: product.basePrice ?? 0,
      colors,
      sizes,
      sizePrices,
      sizeStocks,
      defaultStock: 10,
      lowStockThreshold: firstVariant?.lowStockThreshold ?? 3,
      status: product.status,
      warehouse: firstVariant?.warehouse || "Principal",
    });
    setIsModalOpen(true);
  }

  function handleEditSelected() {
    if (!selectedSku) return;
    const row = inventoryRows.find((item) => item.sku === selectedSku);
    if (row) handleEdit(row);
  }

  async function handleDeleteSelected() {
    if (!selectedSku) return;
    await handleDelete(selectedSku);
    setSelectedSku(null);
  }

  function handleCloseModal() {
    if (saving) return;
    setEditingSku(null);
    setEditingParentSku(null);
    setForm(initialForm);
    setProductForm(initialProductForm);
    setIsModalOpen(false);
  }

  function toggleProductOption(field: "colors" | "sizes", value: string) {
    setProductForm((previous) => {
      const current = previous[field] || [];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      const nextSizePrices = field === "sizes" ? { ...(previous.sizePrices || {}) } : previous.sizePrices;
      const nextSizeStocks = field === "sizes" ? { ...(previous.sizeStocks || {}) } : previous.sizeStocks;

      if (field === "sizes" && !current.includes(value)) {
        nextSizePrices![value] = previous.basePrice;
        nextSizeStocks![value] = previous.defaultStock ?? 0;
      }

      return {
        ...previous,
        [field]: next,
        sizePrices: nextSizePrices,
        sizeStocks: nextSizeStocks,
      };
    });
  }

  function updateSizePrice(size: string, price: number) {
    setProductForm((previous) => ({
      ...previous,
      sizePrices: {
        ...(previous.sizePrices || {}),
        [size]: price,
      },
    }));
  }

  function updateSizeStock(size: string, stock: number) {
    setProductForm((previous) => ({
      ...previous,
      sizeStocks: {
        ...(previous.sizeStocks || {}),
        [size]: stock,
      },
    }));
  }

  function updateOption(key: string, value: string) {
    setForm((previous) => ({
      ...previous,
      options: {
        ...(previous.options || {}),
        [key]: value,
      },
    }));
  }

  function handleRowSelection(sku: string, event: ReactMouseEvent<HTMLTableRowElement>) {
    const withMultiSelect = event.ctrlKey || event.metaKey;
    setSelectedSku((previous) => (withMultiSelect && previous === sku ? null : sku));
  }

  const collections = useMemo(
    () => Array.from(new Set(inventoryProducts.map((row) => row.collection).filter(Boolean))).sort() as string[],
    [inventoryProducts],
  );

  const categories = useMemo(
    () => Array.from(new Set(inventoryProducts.map((row) => row.category).filter(Boolean))).sort() as string[],
    [inventoryProducts],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventoryProducts.filter((product) => {
      const variantText = product.variants.map((variant) => [variant.sku, variant.color, variant.size, variant.warehouse].join(" ")).join(" ");
      const threshold = Math.min(...product.variants.map((variant) => variant.lowStockThreshold ?? 3));
      const matchesQuery = !query || [product.parentSku, product.product, product.collection, variantText].join(" ").toLowerCase().includes(query);
      const matchesCollection = collectionFilter === "all" || product.collection === collectionFilter;
      const matchesStatus = statusFilter === "all" || product.variants.some((variant) => (variant.status ?? "active") === statusFilter);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "out" && product.totalAvailable <= 0) ||
        (stockFilter === "low" && product.totalAvailable > 0 && product.totalAvailable <= threshold) ||
        (stockFilter === "available" && product.totalAvailable > threshold);

      return matchesQuery && matchesCollection && matchesStatus && matchesStock;
    });
  }, [collectionFilter, inventoryProducts, search, statusFilter, stockFilter]);

  const metrics = useMemo(() => {
    return inventoryProducts.reduce(
      (acc, row) => {
        const threshold = Math.min(...row.variants.map((variant) => variant.lowStockThreshold ?? 3));

        acc.totalSkus += row.variants.length;
        acc.totalProducts += 1;
        acc.totalOnHand += row.totalOnHand;
        acc.totalReserved += row.totalReserved;
        acc.totalSold += row.totalSold;
        acc.totalAvailable += row.totalAvailable;
        if (row.totalAvailable <= 0) acc.outOfStock += 1;
        else if (row.totalAvailable <= threshold) acc.lowStock += 1;
        return acc;
      },
      { totalProducts: 0, totalSkus: 0, totalOnHand: 0, totalReserved: 0, totalSold: 0, totalAvailable: 0, lowStock: 0, outOfStock: 0 },
    );
  }, [inventoryProducts]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const paginatedInventory = useMemo(
    () => filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [currentPage, filteredProducts],
  );

  const catalogProducts = useMemo(() => {
    return inventoryProducts.filter((product) => {
      const matchesCollection = catalogOptions.collection === "all" || product.collection === catalogOptions.collection;
      const matchesCategory = catalogOptions.category === "all" || product.category === catalogOptions.category;
      const matchesStock = catalogOptions.includeOutOfStock || product.totalAvailable > 0;
      const matchesStatus = product.status === "active";

      return matchesCollection && matchesCategory && matchesStock && matchesStatus;
    });
  }, [catalogOptions.category, catalogOptions.collection, catalogOptions.includeOutOfStock, inventoryProducts]);

  const catalogFileName = useMemo(() => {
    const scope = [catalogOptions.collection, catalogOptions.category].filter((value) => value !== "all").join("-") || "catalogo";
    return `yorusito-${scope}-${catalogOptions.format}.pdf`.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  }, [catalogOptions.category, catalogOptions.collection, catalogOptions.format]);

  const canEditSelected = Boolean(selectedSku);
  const canDeleteSelected = Boolean(selectedSku);

  return (
    <AdminShell title="Inventario" subtitle="Catalogo sincronizado por SKU, variante, stock disponible y alertas de reposicion.">
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={faLayerGroup} label="Productos" value={metrics.totalProducts} detail={`${metrics.totalSkus} variantes sincronizadas`} />
        <MetricCard icon={faBoxOpen} label="Disponible" value={metrics.totalAvailable} detail={`${metrics.totalOnHand} en mano / ${metrics.totalReserved} reservado / ${metrics.totalSold} vendido`} />
        <MetricCard icon={faTriangleExclamation} label="Bajo stock" value={metrics.lowStock} detail="Por debajo del umbral" tone="warn" />
        <MetricCard icon={faXmark} label="Sin stock" value={metrics.outOfStock} detail="Requieren reposicion" tone="danger" />
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Stock por SKU</h3>
            <p className="text-sm text-zinc-500">La carga sincroniza automaticamente productos, colores y tallas faltantes desde la tienda.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton icon={faRotate} label="Sincronizar" onClick={fetchInventory} disabled={loading || saving} />
            <ActionButton icon={faFilePdf} label="Generar catalogo" onClick={() => setIsCatalogModalOpen(true)} />
            <ActionButton icon={faPlus} label="Agregar producto" onClick={handleCreate} tone="success" />
            <ActionButton icon={faPen} label="Editar" onClick={handleEditSelected} disabled={!canEditSelected} tone="warn" />
            <ActionButton icon={faXmark} label="Eliminar" onClick={handleDeleteSelected} disabled={!canDeleteSelected} tone="danger" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_12rem_12rem_12rem]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar SKU, producto, color, talla..."
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950"
          />
          <select value={collectionFilter} onChange={(event) => setCollectionFilter(event.target.value)} className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950">
            <option value="all">Todas las colecciones</option>
            {collections.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950">
            <option value="all">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="draft">Borrador</option>
            <option value="archived">Archivado</option>
          </select>
          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value as StockFilter)} className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-950">
            <option value="all">Todo stock</option>
            <option value="available">Disponible</option>
            <option value="low">Bajo stock</option>
            <option value="out">Sin stock</option>
          </select>
        </div>

        {loading ? <p className="mt-4 text-sm text-zinc-500">Cargando y sincronizando catalogo...</p> : null}
        {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-100">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Variante</th>
                <th className="px-4 py-3">SKU variante</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">En mano</th>
                <th className="px-4 py-3 text-right">Reservado</th>
                <th className="px-4 py-3 text-right">Vendido</th>
                <th className="px-4 py-3 text-right">Disponible</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInventory.map((product) => {
                const productTone = product.totalAvailable <= 0 ? "danger" : product.totalAvailable <= 3 ? "warn" : "ok";

                return (
                  <Fragment key={product.parentSku}>
                    <tr className="cursor-pointer border-t border-zinc-200 bg-zinc-50/80 transition hover:bg-zinc-100" onDoubleClick={() => handleEditProduct(product)}>
                      <td className="px-4 py-4" colSpan={3}>
                        <div className="flex min-w-72 items-center gap-3">
                          {product.images[0] ? <img src={product.images[0]} alt={product.product} className="h-14 w-14 rounded-xl object-cover ring-1 ring-zinc-200" /> : <div className="h-14 w-14 rounded-xl bg-zinc-100" />}
                          <div>
                            <p className="font-black text-zinc-950">{product.product}</p>
                            <p className="font-mono text-xs text-zinc-500">{product.parentSku} · {product.collection || "Sin coleccion"} · {product.variants.length} variantes</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold">S/ {(product.basePrice ?? 0).toFixed(2)}</td>
                      <td className="px-4 py-4 text-right font-semibold">{product.totalOnHand}</td>
                      <td className="px-4 py-4 text-right font-semibold">{product.totalReserved}</td>
                      <td className="px-4 py-4 text-right font-semibold">{product.totalSold}</td>
                      <td className="px-4 py-4 text-right"><StockBadge value={product.totalAvailable} tone={productTone} /></td>
                      <td className="px-4 py-4"><StatusBadge status={product.status} /></td>
                    </tr>
                    {product.variants.map((row) => {
                      const available = row.onHand - row.reserved;
                      const threshold = row.lowStockThreshold ?? 3;
                      const stockTone = available <= 0 ? "danger" : available <= threshold ? "warn" : "ok";

                      return (
                        <tr
                          key={row.sku}
                          className={[
                            "cursor-pointer border-t border-zinc-100 transition hover:bg-zinc-50",
                            selectedSku === row.sku ? "bg-amber-50 hover:bg-amber-50" : "",
                          ].join(" ")}
                          onClick={(event) => handleRowSelection(row.sku, event)}
                          onDoubleClick={() => handleEdit(row)}
                        >
                          <td className="px-4 py-3 text-zinc-400">└─</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              <Badge>Color: {row.color || "Unico"}</Badge>
                              <Badge>Talla: {row.size || "STD"}</Badge>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-700">{row.sku}</td>
                          <td className="px-4 py-3 text-right font-semibold">S/ {(row.price ?? 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">{row.onHand}</td>
                          <td className="px-4 py-3 text-right">{row.reserved}</td>
                          <td className="px-4 py-3 text-right">{row.sold ?? 0}</td>
                          <td className="px-4 py-3 text-right">
                            <StockBadge value={available} tone={stockTone} />
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={row.status ?? "active"} /></td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
              {!paginatedInventory.length && !loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-zinc-500">
                    No hay SKUs que coincidan con los filtros.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
          <p>
            Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
          </p>
          <div className="flex items-center gap-2">
            <PagerButton icon={faChevronLeft} label="Pagina anterior" disabled={currentPage === 1} onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))} />
            <span className="min-w-24 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Pagina {currentPage} de {totalPages}
            </span>
            <PagerButton icon={faChevronRight} label="Pagina siguiente" disabled={currentPage === totalPages} onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))} />
          </div>
        </div>
      </section>

      <CrudModal
        isOpen={isModalOpen}
        title={editingParentSku ? `Editar producto ${editingParentSku}` : "Crear producto"}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleProductSubmit}
      >
        <div className="grid gap-5 lg:grid-cols-[16rem_1fr]">
          <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
              {productForm.image ? (
                <img src={productForm.image} alt={productForm.product || "Producto"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-zinc-400">Sin imagen</div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">SKU generado</p>
              <p className="font-mono text-lg font-black text-zinc-950">{productForm.parentSku || "Automatico"}</p>
              <p className="text-sm text-zinc-500">{productForm.colors.length} colores x {productForm.sizes.length} tallas = {productForm.colors.length * productForm.sizes.length} variantes</p>
              <StatusBadge status={productForm.status ?? "active"} />
            </div>
          </aside>

          <div className="space-y-5">
            <FormSection title="Producto padre" description="Edita el articulo comercial. IDs y SKUs se generan automaticamente.">
              <Field label="Producto">
                <input type="text" value={productForm.product} onChange={(event) => setProductForm((previous) => ({ ...previous, product: event.target.value }))} placeholder="Nombre comercial" required className={inputClass} />
              </Field>
              <Field label="Tipo de prenda">
                <select value={productForm.category || "Polo"} onChange={(event) => setProductForm((previous) => ({ ...previous, category: event.target.value }))} className={inputClass}>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Coleccion">
                <select value={productForm.collection || ""} onChange={(event) => setProductForm((previous) => ({ ...previous, collection: event.target.value }))} className={inputClass}>
                  <option value="">Selecciona coleccion</option>
                  {collectionOptions.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estado">
                <select value={productForm.status ?? "active"} onChange={(event) => setProductForm((previous) => ({ ...previous, status: event.target.value as AdminInventoryItem["status"] }))} className={inputClass}>
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <RichTextEditor
                  label="Descripcion completa"
                  value={productForm.description || ""}
                  onChange={(description) => setProductForm((previous) => ({ ...previous, description }))}
                />
              </div>
            </FormSection>

            <FormSection title="Colores disponibles" description="Selecciona los colores que generan variantes.">
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {colorOptions.map((color) => {
                  const selected = productForm.colors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => toggleProductOption("colors", color.name)}
                      className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition",
                        selected ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
                      ].join(" ")}
                    >
                      <span className={`h-4 w-4 rounded-full ${color.className}`} />
                      {color.name}
                    </button>
                  );
                })}
              </div>
              <Field label="Color personalizado" className="sm:col-span-2">
                <AddTokenInput placeholder="Agregar color y presionar Enter" onAdd={(value) => setProductForm((previous) => ({ ...previous, colors: Array.from(new Set([...previous.colors, value])) }))} />
              </Field>
            </FormSection>

            <FormSection title="Tallas, precios y stock" description="Define tallas activas, precio final y stock por talla. XL puede costar mas.">
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {sizeOptions.map((size) => {
                  const selected = productForm.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleProductOption("sizes", size)}
                      className={[
                        "min-w-14 rounded-xl border px-3 py-2 text-sm font-black transition",
                        selected ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
                      ].join(" ")}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <div className="sm:col-span-2 overflow-hidden rounded-xl border border-zinc-200">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Talla</th>
                      <th className="px-3 py-2">Precio</th>
                      <th className="px-3 py-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productForm.sizes.map((size) => (
                      <tr key={size} className="border-t border-zinc-100">
                        <td className="px-3 py-2 font-black">{size}</td>
                        <td className="px-3 py-2">
                          <input type="number" min="0" step="0.01" value={productForm.sizePrices?.[size] ?? productForm.basePrice} onChange={(event) => updateSizePrice(size, Number(event.target.value))} className={inputClass} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min="0" value={productForm.sizeStocks?.[size] ?? productForm.defaultStock ?? 0} onChange={(event) => updateSizeStock(size, Number(event.target.value))} className={inputClass} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FormSection>

            <FormSection title="Vista previa de variantes" description="Estas variantes se crean o actualizan automaticamente.">
              <div className="sm:col-span-2 max-h-64 overflow-auto rounded-xl border border-zinc-200">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Color</th>
                      <th className="px-3 py-2">Talla</th>
                      <th className="px-3 py-2">Precio</th>
                      <th className="px-3 py-2">Stock inicial</th>
                      <th className="px-3 py-2">SKU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productForm.colors.flatMap((color) =>
                      productForm.sizes.map((size) => (
                        <tr key={`${color}-${size}`} className="border-t border-zinc-100">
                          <td className="px-3 py-2">{color}</td>
                          <td className="px-3 py-2 font-bold">{size}</td>
                          <td className="px-3 py-2">S/ {(productForm.sizePrices?.[size] ?? productForm.basePrice).toFixed(2)}</td>
                          <td className="px-3 py-2">{productForm.sizeStocks?.[size] ?? productForm.defaultStock ?? 0}</td>
                          <td className="px-3 py-2 font-mono text-xs text-zinc-500">{productForm.parentSku ? `${productForm.parentSku}-...` : "Automatico"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </FormSection>

            <FormSection title="Imagen y control" description="La imagen se aplica al producto padre y a sus variantes.">
              <Field label="URL de imagen">
                <input value={productForm.image || ""} onChange={(event) => setProductForm((previous) => ({ ...previous, image: event.target.value }))} placeholder="https://i.ibb.co/..." className={inputClass} />
              </Field>
              <Field label="Avisar bajo stock">
                <input type="number" min="0" value={productForm.lowStockThreshold ?? 3} onChange={(event) => setProductForm((previous) => ({ ...previous, lowStockThreshold: Number(event.target.value) }))} required className={inputClass} />
              </Field>
              <Field label="Almacen">
                <input value={productForm.warehouse || "Principal"} onChange={(event) => setProductForm((previous) => ({ ...previous, warehouse: event.target.value }))} required className={inputClass} />
              </Field>
            </FormSection>

            <FormSection title="Referencia interna" description="Solo lectura. Si algun dia quieres cambiar IDs o SKUs, hazlo desde DB.">
              <Field label="Producto ID">
                <input value={productForm.productId ?? "Automatico"} disabled className={inputClass} />
              </Field>
              <Field label="SKU padre">
                <input value={productForm.parentSku || "Automatico"} disabled className={inputClass} />
              </Field>
            </FormSection>
          </div>
        </div>
      </CrudModal>

      {isCatalogModalOpen ? (
        <CatalogGeneratorModal
          products={catalogProducts}
          collections={collections}
          categories={categories}
          options={catalogOptions}
          fileName={catalogFileName}
          setOptions={setCatalogOptions}
          onClose={() => setIsCatalogModalOpen(false)}
        />
      ) : null}
    </AdminShell>
  );
}

function MetricCard({ icon, label, value, detail, tone = "default" }: { icon: any; label: string; value: number; detail: string; tone?: "default" | "warn" | "danger" }) {
  const toneClasses = {
    default: "border-zinc-200 bg-white text-zinc-950",
    warn: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          <p className="mt-1 text-sm opacity-70">{detail}</p>
        </div>
        <FontAwesomeIcon icon={icon} className="mt-1 h-5 w-5 opacity-70" />
      </div>
    </article>
  );
}

function ActionButton({ icon, label, onClick, disabled = false, tone = "default" }: { icon: any; label: string; onClick: () => void; disabled?: boolean; tone?: "default" | "success" | "warn" | "danger" }) {
  const toneClasses = {
    default: "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    warn: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400 ${toneClasses[tone]}`}
      title={label}
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function PagerButton({ icon, label, disabled, onClick }: { icon: any; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
      aria-label={label}
      title={label}
    >
      <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-700">{children}</span>;
}

function StockBadge({ value, tone }: { value: number; tone: "ok" | "warn" | "danger" }) {
  const classes = {
    ok: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  return <span className={`inline-flex min-w-12 justify-center rounded-full border px-2 py-1 text-xs font-black ${classes[tone]}`}>{value}</span>;
}

function StatusBadge({ status }: { status: NonNullable<AdminInventoryItem["status"]> }) {
  const labels = {
    active: "Activo",
    draft: "Borrador",
    archived: "Archivado",
  };
  const classes = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    draft: "border-zinc-200 bg-zinc-50 text-zinc-600",
    archived: "border-red-200 bg-red-50 text-red-700",
  };

  return <span className={`rounded-full border px-2 py-1 text-xs font-bold ${classes[status]}`}>{labels[status]}</span>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-zinc-700 ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function AddTokenInput({ placeholder, onAdd }: { placeholder: string; onAdd: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const nextValue = value.trim();
        if (!nextValue) return;
        onAdd(nextValue);
        setValue("");
      }}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}

function RichTextEditor({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  }

  function handleInput() {
    onChange(editorRef.current?.innerHTML || "");
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold text-zinc-700">{label}</span>
      <div className="overflow-hidden rounded-2xl border border-zinc-300 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-50 p-2">
          <EditorButton label="B" title="Negrita" onClick={() => runCommand("bold")} strong />
          <EditorButton label="I" title="Cursiva" onClick={() => runCommand("italic")} italic />
          <EditorButton label="U" title="Subrayado" onClick={() => runCommand("underline")} underline />
          <EditorDivider />
          <EditorButton label="Normal" title="Texto normal" onClick={() => runCommand("formatBlock", "p")} />
          <EditorButton label="Titulo" title="Titulo grande" onClick={() => runCommand("formatBlock", "h2")} />
          <EditorButton label="Subtitulo" title="Subtitulo" onClick={() => runCommand("formatBlock", "h3")} />
          <EditorDivider />
          <EditorButton label="Izq" title="Alinear izquierda" onClick={() => runCommand("justifyLeft")} />
          <EditorButton label="Centro" title="Centrar" onClick={() => runCommand("justifyCenter")} />
          <EditorButton label="Der" title="Alinear derecha" onClick={() => runCommand("justifyRight")} />
          <EditorButton label="Just" title="Justificar" onClick={() => runCommand("justifyFull")} />
          <EditorDivider />
          <EditorButton label="Lista" title="Lista con puntos" onClick={() => runCommand("insertUnorderedList")} />
          <EditorButton label="1. Lista" title="Lista numerada" onClick={() => runCommand("insertOrderedList")} />
          <EditorButton label="Limpiar" title="Quitar formato" onClick={() => runCommand("removeFormat")} />
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          className="min-h-72 max-h-[28rem] overflow-y-auto px-4 py-3 text-sm leading-7 text-zinc-800 outline-none prose-headings:font-black"
        />
      </div>
      <p className="text-xs text-zinc-500">Puedes pegar texto, seleccionar una parte y aplicar formato. Se guarda como HTML para conservar estilos.</p>
    </div>
  );
}

function EditorButton({
  label,
  title,
  onClick,
  strong = false,
  italic = false,
  underline = false,
}: {
  label: string;
  title: string;
  onClick: () => void;
  strong?: boolean;
  italic?: boolean;
  underline?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100",
        strong ? "font-black" : "font-semibold",
        italic ? "italic" : "",
        underline ? "underline" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function EditorDivider() {
  return <span className="mx-1 h-8 w-px bg-zinc-200" />;
}

function FormSection({ title, description, children, columns = "two" }: { title: string; description: string; children: React.ReactNode; columns?: "one" | "two" }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-4">
        <h4 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-950">{title}</h4>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>
      <div className={columns === "one" ? "grid gap-3" : "grid gap-3 sm:grid-cols-2"}>{children}</div>
    </section>
  );
}

