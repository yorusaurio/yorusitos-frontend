"use client";

import React from "react";
import { Document, Image, Page, PDFDownloadLink, StyleSheet, Text, View } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import currency from "currency.js";
import type { AdminInventoryProduct } from "@/lib/admin-data";

export type CatalogFormat = "social-horizontal" | "a4" | "instagram";
export type CatalogPriceMode = "retail" | "wholesale";

export interface CatalogOptions {
  collection: string;
  category: string;
  includeOutOfStock: boolean;
  priceMode: CatalogPriceMode;
  wholesaleDiscount: number;
  format: CatalogFormat;
  includeSku: boolean;
  includeVariants: boolean;
  previewReady: boolean;
}

const inputClass = "rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-500";

export default function CatalogGeneratorModal({
  products,
  collections,
  categories,
  options,
  fileName,
  setOptions,
  onClose,
}: {
  products: AdminInventoryProduct[];
  collections: string[];
  categories: string[];
  options: CatalogOptions;
  fileName: string;
  setOptions: React.Dispatch<React.SetStateAction<CatalogOptions>>;
  onClose: () => void;
}) {
  function updateOption<K extends keyof CatalogOptions>(key: K, value: CatalogOptions[K]) {
    setOptions((previous) => ({ ...previous, [key]: value, previewReady: key === "previewReady" ? Boolean(value) : false }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-3 py-4 backdrop-blur-[2px]">
      <div className="w-full max-w-7xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-black text-zinc-950">Generador de catalogo</h3>
            <p className="text-sm text-zinc-500">Configura, previsualiza y descarga un catalogo PDF listo para compartir.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-xl leading-none text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900" aria-label="Cerrar generador">
            X
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[23rem_minmax(0,1fr)]">
          <aside className="border-r border-zinc-200 bg-zinc-50 p-5">
            <div className="space-y-4">
              <Field label="Coleccion">
                <select value={options.collection} onChange={(event) => updateOption("collection", event.target.value)} className={inputClass}>
                  <option value="all">Todas las colecciones</option>
                  {collections.map((collection) => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select>
              </Field>

              <Field label="Categoria">
                <select value={options.category} onChange={(event) => updateOption("category", event.target.value)} className={inputClass}>
                  <option value="all">Todas las categorias</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </Field>

              <Field label="Formato">
                <select value={options.format} onChange={(event) => updateOption("format", event.target.value as CatalogFormat)} className={inputClass}>
                  <option value="social-horizontal">Redes horizontal 16:9</option>
                  <option value="a4">PDF A4 horizontal</option>
                  <option value="instagram">Instagram cuadrado</option>
                </select>
              </Field>

              <Field label="Precio">
                <select value={options.priceMode} onChange={(event) => updateOption("priceMode", event.target.value as CatalogPriceMode)} className={inputClass}>
                  <option value="retail">Minorista</option>
                  <option value="wholesale">Mayorista</option>
                </select>
              </Field>

              {options.priceMode === "wholesale" ? (
                <Field label="Descuento mayorista (%)">
                  <input type="number" min="0" max="80" value={options.wholesaleDiscount} onChange={(event) => updateOption("wholesaleDiscount", Math.max(0, Math.min(80, Number(event.target.value) || 0)))} className={inputClass} />
                </Field>
              ) : null}

              <OptionSwitch label="Incluir sin stock" checked={options.includeOutOfStock} onChange={(checked) => updateOption("includeOutOfStock", checked)} />
              <OptionSwitch label="Incluir SKU" checked={options.includeSku} onChange={(checked) => updateOption("includeSku", checked)} />
              <OptionSwitch label="Incluir colores/tallas" checked={options.includeVariants} onChange={(checked) => updateOption("includeVariants", checked)} />

              <div className="rounded-2xl bg-zinc-950 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Resultado</p>
                <p className="mt-2 text-3xl font-black">{products.length}</p>
                <p className="text-sm text-zinc-300">productos listos para exportar</p>
              </div>

              <button
                type="button"
                onClick={() => updateOption("previewReady", true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-black text-zinc-900 transition hover:bg-zinc-100"
              >
                <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                Generar vista previa
              </button>

              <PDFDownloadLink
                document={<CatalogPdfDocument products={products} options={options} />}
                fileName={fileName}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${products.length ? "bg-zinc-950 text-white hover:bg-zinc-800" : "pointer-events-none bg-zinc-200 text-zinc-500"}`}
              >
                {({ loading }) => (
                  <>
                    <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
                    {loading ? "Preparando PDF..." : "Descargar PDF"}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </aside>

          <section className="min-h-[42rem] bg-zinc-100 p-5">
            {options.previewReady ? (
              <CatalogPreview products={products} options={options} />
            ) : (
              <div className="flex min-h-[38rem] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-center">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-400">Vista previa pendiente</p>
                  <p className="mt-2 text-lg font-bold text-zinc-900">Configura el catalogo y genera una vista previa.</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-zinc-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function OptionSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
    </label>
  );
}

function CatalogPreview({ products, options }: { products: AdminInventoryProduct[]; options: CatalogOptions }) {
  const frameClass = {
    "social-horizontal": "mx-auto max-w-6xl",
    a4: "mx-auto max-w-6xl",
    instagram: "mx-auto max-w-2xl",
  }[options.format];
  const groupedProducts = groupCatalogProducts(products);

  return (
    <div className={`${frameClass} overflow-hidden rounded-3xl bg-[#f5f5f3] shadow-xl ring-1 ring-zinc-200`}>
      <div className="flex items-end justify-between gap-4 bg-zinc-950 px-8 py-6 text-white">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">Yorusito catalog</p>
          <h4 className="mt-1 text-4xl font-black uppercase tracking-tight">Catalogo {options.priceMode === "wholesale" ? "Mayorista" : "Minorista"}</h4>
        </div>
        <p className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-zinc-200">{products.length} productos</p>
      </div>
      <div className="space-y-7 p-7">
        {groupedProducts.map((group) => (
          <section key={group.name} className="space-y-4">
            <div className="flex items-center gap-3">
              <h5 className="text-xl font-black uppercase tracking-[0.18em] text-zinc-950">{group.name}</h5>
              <div className="h-px flex-1 bg-zinc-300" />
            </div>
            <div className={`grid gap-5 ${options.format === "instagram" ? "grid-cols-2" : "grid-cols-3"}`}>
              {group.products.map((product) => (
                <CatalogPreviewCard key={product.parentSku} product={product} options={options} />
              ))}
            </div>
          </section>
        ))}
        {!products.length ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm font-semibold text-zinc-500">
            No hay productos para los filtros seleccionados.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CatalogPreviewCard({ product, options }: { product: AdminInventoryProduct; options: CatalogOptions }) {
  const price = catalogProductPrice(product, options);
  const colors = Array.from(new Set(product.variants.map((variant) => variant.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size).filter(Boolean))) as string[];

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-gradient-to-br from-white via-zinc-50 to-zinc-100 p-3">
        {product.images[0] ? <img src={product.images[0]} alt={product.product} className="h-full w-full object-contain drop-shadow-xl" /> : null}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h5 className="text-sm font-black uppercase leading-tight text-zinc-950">{product.product}</h5>
          <p className="whitespace-nowrap text-xl font-black text-zinc-950">{currency(price, { symbol: "S/ " }).format()}</p>
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400">{product.collection || product.category || "Yorusito"}</p>
        {options.includeVariants ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {colors.map((color) => (
                <span key={color} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 pr-2 text-[10px] font-bold uppercase text-zinc-600 ring-1 ring-zinc-200">
                  <span className="h-4 w-4 rounded-full ring-1 ring-zinc-300" style={{ backgroundColor: colorToHex(color) }} />
                  {color}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <span key={size} className="rounded-md bg-zinc-950 px-2 py-1 text-[10px] font-black uppercase text-white">{size}</span>
              ))}
            </div>
          </div>
        ) : null}
        {options.includeSku ? <p className="font-mono text-[11px] text-zinc-400">{product.parentSku}</p> : null}
      </div>
    </article>
  );
}

const pdfStyles = StyleSheet.create({
  page: { padding: 22, backgroundColor: "#f5f5f3", fontFamily: "Helvetica" },
  cover: { backgroundColor: "#09090b", color: "#ffffff", padding: 22, marginBottom: 14, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  eyebrow: { fontSize: 8, color: "#a1a1aa", letterSpacing: 2, textTransform: "uppercase" },
  title: { marginTop: 5, fontSize: 28, fontWeight: 700 },
  subtitle: { marginTop: 5, fontSize: 10, color: "#d4d4d8" },
  countPill: { borderWidth: 1, borderColor: "#3f3f46", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, fontSize: 10, color: "#e4e4e7" },
  section: { marginBottom: 14 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: 700, letterSpacing: 1.8, textTransform: "uppercase", color: "#09090b" },
  sectionLine: { height: 1, backgroundColor: "#d4d4d8", flexGrow: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: { width: "31.8%", overflow: "hidden", backgroundColor: "#ffffff", borderRadius: 14, borderWidth: 1, borderColor: "#e4e4e7", marginBottom: 10 },
  cardSquare: { width: "48%" },
  imageWrap: { width: "100%", height: 145, padding: 7, backgroundColor: "#fafafa" },
  image: { width: "100%", height: "100%", objectFit: "contain" },
  body: { padding: 10 },
  product: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#09090b" },
  meta: { marginTop: 4, fontSize: 7, color: "#71717a", textTransform: "uppercase" },
  price: { marginTop: 8, fontSize: 14, fontWeight: 700, color: "#09090b" },
  swatchRow: { marginTop: 7, flexDirection: "row", flexWrap: "wrap", gap: 5 },
  swatchItem: { flexDirection: "row", alignItems: "center", gap: 3, borderWidth: 1, borderColor: "#e4e4e7", borderRadius: 999, paddingRight: 5, backgroundColor: "#fafafa" },
  swatchDot: { width: 10, height: 10, borderRadius: 999, borderWidth: 0.5, borderColor: "#a1a1aa" },
  swatchText: { fontSize: 5.8, color: "#52525b", textTransform: "uppercase" },
  sizeRow: { marginTop: 6, flexDirection: "row", flexWrap: "wrap", gap: 4 },
  sizeChip: { backgroundColor: "#09090b", color: "#ffffff", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 3, fontSize: 6, fontWeight: 700 },
  sku: { marginTop: 5, fontSize: 6, color: "#a1a1aa" },
});

function CatalogPdfDocument({ products, options }: { products: AdminInventoryProduct[]; options: CatalogOptions }) {
  const pageSize = options.format === "a4" ? [842, 595] : options.format === "instagram" ? [612, 612] : [960, 540];
  const groupedProducts = groupCatalogProducts(products);

  return (
    <Document>
      <Page size={pageSize as any} style={pdfStyles.page}>
        <View style={pdfStyles.cover}>
          <View>
            <Text style={pdfStyles.eyebrow}>Yorusito catalog</Text>
            <Text style={pdfStyles.title}>Catalogo {options.priceMode === "wholesale" ? "Mayorista" : "Minorista"}</Text>
            <Text style={pdfStyles.subtitle}>{new Date().toLocaleDateString("es-PE")}</Text>
          </View>
          <Text style={pdfStyles.countPill}>{products.length} productos</Text>
        </View>

        {groupedProducts.map((group) => (
          <View key={group.name} style={pdfStyles.section}>
            <View style={pdfStyles.sectionHeader}>
              <Text style={pdfStyles.sectionTitle}>{group.name}</Text>
              <View style={pdfStyles.sectionLine} />
            </View>
            <View style={pdfStyles.grid}>
              {group.products.map((product) => (
                <CatalogPdfCard key={product.parentSku} product={product} options={options} />
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}

function CatalogPdfCard({ product, options }: { product: AdminInventoryProduct; options: CatalogOptions }) {
  const colors = Array.from(new Set(product.variants.map((variant) => variant.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(product.variants.map((variant) => variant.size).filter(Boolean))) as string[];

  return (
    <View style={[pdfStyles.card, options.format === "instagram" ? pdfStyles.cardSquare : {}]}>
      <View style={pdfStyles.imageWrap}>
        {product.images[0] ? <Image src={product.images[0]} style={pdfStyles.image} /> : <View style={pdfStyles.image} />}
      </View>
      <View style={pdfStyles.body}>
        <Text style={pdfStyles.product}>{product.product}</Text>
        <Text style={pdfStyles.meta}>{product.collection || product.category || "Yorusito"}</Text>
        <Text style={pdfStyles.price}>{currency(catalogProductPrice(product, options), { symbol: "S/ " }).format()}</Text>
        {options.includeVariants ? (
          <>
            <View style={pdfStyles.swatchRow}>
              {colors.map((color) => (
                <View key={color} style={pdfStyles.swatchItem}>
                  <View style={[pdfStyles.swatchDot, { backgroundColor: colorToHex(color) }]} />
                  <Text style={pdfStyles.swatchText}>{color}</Text>
                </View>
              ))}
            </View>
            <View style={pdfStyles.sizeRow}>
              {sizes.map((size) => (
                <Text key={size} style={pdfStyles.sizeChip}>{size}</Text>
              ))}
            </View>
          </>
        ) : null}
        {options.includeSku ? <Text style={pdfStyles.sku}>{product.parentSku}</Text> : null}
      </View>
    </View>
  );
}

function groupCatalogProducts(products: AdminInventoryProduct[]) {
  const groups = new Map<string, AdminInventoryProduct[]>();

  for (const product of products) {
    const key = product.collection || product.category || "Catalogo";
    groups.set(key, [...(groups.get(key) || []), product]);
  }

  return Array.from(groups.entries()).map(([name, groupProducts]) => ({ name, products: groupProducts }));
}

function colorToHex(color: string) {
  const normalized = color.trim().toLowerCase();
  const palette: Record<string, string> = {
    blanco: "#ffffff",
    white: "#ffffff",
    negro: "#111111",
    black: "#111111",
    rojo: "#dc2626",
    red: "#dc2626",
    azul: "#2563eb",
    blue: "#2563eb",
    verde: "#059669",
    green: "#059669",
    rosa: "#f472b6",
    pink: "#f472b6",
    melange: "#d4d4d8",
    gris: "#9ca3af",
    gray: "#9ca3af",
    plomo: "#71717a",
    amarillo: "#facc15",
    yellow: "#facc15",
    morado: "#7c3aed",
    purple: "#7c3aed",
    beige: "#d6c3a5",
    crema: "#f5e6c8",
  };

  return palette[normalized] || "#d4d4d8";
}

function catalogProductPrice(product: AdminInventoryProduct, options: CatalogOptions) {
  const prices = product.variants.map((variant) => variant.price ?? product.basePrice ?? 0).filter((price) => price > 0);
  const basePrice = prices.length ? Math.min(...prices) : product.basePrice ?? 0;
  if (options.priceMode === "retail") return currency(basePrice).value;

  return currency(basePrice).multiply(1 - options.wholesaleDiscount / 100).value;
}
