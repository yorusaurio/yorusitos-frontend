import type { AdminContact, AdminCustomerInsight, AdminCustomerSummary, AdminInventoryItem, AdminInventoryProduct, AdminInventoryProductInput, AdminSale, AdminSaleItem } from "@/lib/admin-data";
import type { ProductStock, ProductStockMap } from "@/lib/product-stock";
import { deriveSubcollection } from "@/lib/product-subcollection";
import { supabaseTableRequest } from "@/backend/supabase.server";
import { mockProducts } from "@/data/mockProducts";

interface AdminSaleRow {
  id: string;
  order_number: string | null;
  placed_at: string | null;
  customer_id: string | null;
  customer_dni: string | null;
  customer_address: string | null;
  channel: AdminSale["channel"];
  customer: string;
  customer_type: AdminSale["customerType"] | null;
  currency: AdminSale["currency"] | null;
  exchange_rate: number | null;
  subtotal: number | null;
  discount_total: number | null;
  shipping_total: number | null;
  tax_total: number | null;
  amount: number;
  payment_status: AdminSale["paymentStatus"] | null;
  status: AdminSale["status"];
  source: AdminSale["source"] | null;
  notes: string | null;
  sales_rep_id: string | null;
  admin_sale_items?: AdminSaleItemRow[];
}

interface AdminSaleItemRow {
  id: string;
  sale_id: string;
  product_id: number | null;
  parent_sku: string | null;
  variant_sku: string;
  product: string;
  description: string | null;
  color: string | null;
  size: string | null;
  quantity: number;
  stock_available: number | null;
  unit_price: number;
  discount_total: number;
  line_total: number;
}

interface AdminInventoryRow {
  sku: string;
  parent_sku: string | null;
  product_id: number | null;
  product: string;
  summary: string | null;
  description: string | null;
  category: string | null;
  collection: string | null;
  subcollection: string | null;
  color: string | null;
  size: string | null;
  options: Record<string, string> | null;
  price: number | null;
  image: string | null;
  on_hand: number;
  reserved: number;
  sold: number | null;
  low_stock_threshold: number | null;
  status: AdminInventoryItem["status"] | null;
  warehouse: string;
  updated_at: string | null;
}

interface AdminContactRow {
  id: string;
  document_type: AdminContact["documentType"];
  document: string;
  last_name_paterno: string;
  last_name_materno: string;
  names: string;
  sex: AdminContact["sex"];
  birth_date: string;
  numero: string;
  classification: AdminContact["classification"];
  client: string;
  cellphone: string;
  email: string;
  province: string;
  district: string;
  department: string;
  address: string;
  address_number: string;
  reference: string;
  agency: string;
  contacted_by: string[];
  contacted_by_other: string | null;
}

function saleFromRow(row: AdminSaleRow): AdminSale {
  return {
    id: row.id,
    orderNumber: row.order_number ?? undefined,
    placedAt: row.placed_at ?? undefined,
    customerId: row.customer_id ?? undefined,
    customerDni: row.customer_dni ?? undefined,
    customerAddress: row.customer_address ?? undefined,
    channel: row.channel,
    customer: row.customer,
    customerType: row.customer_type ?? undefined,
    currency: row.currency ?? undefined,
    exchangeRate: row.exchange_rate ?? undefined,
    subtotal: row.subtotal ?? undefined,
    discountTotal: row.discount_total ?? undefined,
    shippingTotal: row.shipping_total ?? undefined,
    taxTotal: row.tax_total ?? undefined,
    amount: row.amount,
    paymentStatus: row.payment_status ?? undefined,
    status: row.status,
    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
    salesRepId: row.sales_rep_id ?? undefined,
    items: row.admin_sale_items?.map(saleItemFromRow) ?? [],
  };
}

function saleItemFromRow(row: AdminSaleItemRow): AdminSaleItem {
  return {
    id: row.id,
    saleId: row.sale_id,
    productId: row.product_id ?? undefined,
    parentSku: row.parent_sku ?? undefined,
    variantSku: row.variant_sku,
    product: row.product,
    description: row.description ?? undefined,
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    quantity: row.quantity,
    stockAvailable: row.stock_available ?? undefined,
    unitPrice: row.unit_price,
    discountTotal: row.discount_total,
    lineTotal: row.line_total,
  };
}

function saleItemToRow(saleId: string, item: AdminSaleItem) {
  return {
    sale_id: saleId,
    product_id: item.productId,
    parent_sku: item.parentSku,
    variant_sku: item.variantSku,
    product: item.product,
    description: item.description,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    stock_available: item.stockAvailable,
    unit_price: item.unitPrice,
    discount_total: item.discountTotal,
    line_total: item.lineTotal,
  };
}

function saleToRow(input: Partial<Omit<AdminSale, "id">>) {
  return {
    order_number: input.orderNumber,
    placed_at: input.placedAt,
    customer_id: input.customerId,
    customer_dni: input.customerDni,
    customer_address: input.customerAddress,
    channel: input.channel,
    customer: input.customer,
    customer_type: input.customerType,
    currency: input.currency,
    exchange_rate: input.exchangeRate,
    subtotal: input.subtotal,
    discount_total: input.discountTotal,
    shipping_total: input.shippingTotal,
    tax_total: input.taxTotal,
    amount: input.amount,
    payment_status: input.paymentStatus,
    status: input.status,
    source: input.source,
    notes: input.notes,
    sales_rep_id: input.salesRepId,
  };
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function inventoryFromRow(row: AdminInventoryRow): AdminInventoryItem {
  return {
    sku: row.sku,
    parentSku: row.parent_sku ?? undefined,
    productId: row.product_id ?? undefined,
    product: row.product,
    summary: row.summary ?? undefined,
    description: row.description ?? undefined,
    category: row.category ?? undefined,
    collection: row.collection ?? undefined,
    subcollection: row.subcollection ?? undefined,
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    options: row.options ?? undefined,
    price: row.price ?? undefined,
    image: row.image ?? undefined,
    onHand: row.on_hand,
    reserved: row.reserved,
    sold: row.sold ?? 0,
    lowStockThreshold: row.low_stock_threshold ?? 3,
    status: row.status ?? "active",
    warehouse: row.warehouse,
    updatedAt: row.updated_at ?? undefined,
  };
}

function slugPart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
}

function productPrefix(product: { id: number; collection: string }) {
  return `${slugPart(product.collection)}-${String(product.id).padStart(3, "0")}`;
}

function variantSku(parentSku: string, color: string, size: string) {
  return `${parentSku}-${slugPart(color)}-${slugPart(size)}`;
}

function catalogInventoryRows(): AdminInventoryRow[] {
  return mockProducts.flatMap((product) => {
    const colors = product.colors?.length ? product.colors : ["UNICO"];
    const sizes = product.sizes?.length ? product.sizes : ["STD"];
    const image = product.images?.[0] ?? null;
    const parentSku = productPrefix(product);

    return colors.flatMap((color) =>
      sizes.map((size) => ({
        sku: `${parentSku}-${slugPart(color)}-${slugPart(size)}`,
        parent_sku: parentSku,
        product_id: product.id,
        product: product.name,
        summary: product.description,
        description: product.detailedDescription || product.description,
        category: "Polo",
        collection: product.collection,
        subcollection: deriveSubcollection(product.name, product.collection),
        color,
        size,
        options: { color, size },
        price: product.price,
        image,
        on_hand: 10,
        reserved: 0,
        sold: 0,
        low_stock_threshold: 3,
        status: product.available ? "active" : "draft",
        warehouse: "Principal",
        updated_at: null,
      }))
    );
  });
}

function enrichRowsWithCatalogMetadata(rows: AdminInventoryRow[]) {
  const productsById = new Map(mockProducts.map((product) => [product.id, product]));

  return rows.map((row) => {
    if (!row.product_id) return row;

    const product = productsById.get(row.product_id);
    if (!product) return row;

    const detailedDescription = product.detailedDescription || product.description;
    const shouldUseCatalogDescription = !row.description || row.description.length < detailedDescription.length;

    return {
      ...row,
      summary: row.summary ?? product.description,
      description: shouldUseCatalogDescription ? detailedDescription : row.description,
      category: row.category ?? "Polo",
      subcollection: row.subcollection ?? deriveSubcollection(product.name, product.collection),
      image: row.image ?? product.images?.[0] ?? null,
    };
  });
}

async function syncCatalogInventoryRows(existingRows: AdminInventoryRow[]) {
  const existingSkus = new Set(existingRows.map((row) => row.sku));
  const missingRows = catalogInventoryRows().filter((row) => !existingSkus.has(row.sku));

  if (!missingRows.length) {
    return existingRows;
  }

  const insertedRows = await supabaseTableRequest<AdminInventoryRow[]>("/admin_inventory_items?on_conflict=sku", {
    method: "POST",
    headers: {
      Prefer: "resolution=ignore-duplicates,return=representation",
    },
    body: JSON.stringify(missingRows),
  });

  return [...existingRows, ...insertedRows];
}

function contactFromRow(row: AdminContactRow): AdminContact {
  return {
    id: row.id,
    documentType: row.document_type,
    document: row.document,
    lastNamePaterno: row.last_name_paterno,
    lastNameMaterno: row.last_name_materno,
    names: row.names,
    sex: row.sex,
    birthDate: row.birth_date,
    numero: row.numero,
    classification: row.classification,
    client: row.client,
    cellphone: row.cellphone,
    email: row.email,
    province: row.province,
    district: row.district,
    department: row.department,
    address: row.address,
    addressNumber: row.address_number,
    reference: row.reference,
    agency: row.agency,
    contactedBy: row.contacted_by,
    contactedByOther: row.contacted_by_other ?? undefined,
  };
}

function contactToRow(input: Partial<Omit<AdminContact, "id">>) {
  return {
    document_type: input.documentType,
    document: input.document,
    last_name_paterno: input.lastNamePaterno,
    last_name_materno: input.lastNameMaterno,
    names: input.names,
    sex: input.sex,
    birth_date: input.birthDate,
    numero: input.numero,
    classification: input.classification,
    client: input.client,
    cellphone: input.cellphone,
    email: input.email,
    province: input.province,
    district: input.district,
    department: input.department,
    address: input.address,
    address_number: input.addressNumber,
    reference: input.reference,
    agency: input.agency,
    contacted_by: input.contactedBy,
    contacted_by_other: input.contactedByOther,
  };
}

function normalizeLookup(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function contactMatchesSale(contact: AdminContact, sale: AdminSale) {
  return (
    (!!sale.customerId && sale.customerId === contact.id) ||
    (!!sale.customerDni && sale.customerDni === contact.document) ||
    normalizeLookup(sale.customer) === normalizeLookup(contact.client)
  );
}

function latestSaleDate(sales: AdminSale[]) {
  const timestamps = sales
    .map((sale) => (sale.placedAt ? new Date(sale.placedAt).getTime() : 0))
    .filter((timestamp) => Number.isFinite(timestamp) && timestamp > 0);

  if (!timestamps.length) return undefined;
  return new Date(Math.max(...timestamps)).toISOString();
}

function customerSummary(customers: AdminCustomerInsight[]): AdminCustomerSummary {
  const totalLtv = customers.reduce((sum, customer) => sum + customer.ltv, 0);

  return {
    total: customers.length,
    newCustomers: customers.filter((customer) => customer.saleCount + customer.orderCount <= 1).length,
    recurrent: customers.filter((customer) => customer.saleCount > 1).length,
    highValue: customers.filter((customer) => customer.ltv >= 300).length,
    totalLtv,
  };
}

export async function listSales() {
  const rows = await supabaseTableRequest<AdminSaleRow[]>("/admin_sales?select=*,admin_sale_items(*)&order=id.desc");
  return rows.map(saleFromRow);
}

export async function createSale(input: Omit<AdminSale, "id">) {
  const [row] = await supabaseTableRequest<AdminSaleRow[]>("/admin_sales", {
    method: "POST",
    body: JSON.stringify([compact(saleToRow(input))]),
  });

  if (input.items?.length) {
    await replaceSaleItems(row.id, input.items);
  }

  return (await getSale(row.id)) ?? saleFromRow(row);
}

export async function updateSale(id: string, patch: Partial<Omit<AdminSale, "id">>) {
  const rows = await supabaseTableRequest<AdminSaleRow[]>(`/admin_sales?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(compact(saleToRow(patch))),
  });

  if (!rows[0]) return null;

  if (patch.items) {
    await replaceSaleItems(id, patch.items);
  }

  return getSale(id);
}

async function getSale(id: string) {
  const rows = await supabaseTableRequest<AdminSaleRow[]>(`/admin_sales?id=eq.${encodeURIComponent(id)}&select=*,admin_sale_items(*)&limit=1`);
  return rows[0] ? saleFromRow(rows[0]) : null;
}

async function replaceSaleItems(saleId: string, items: AdminSaleItem[]) {
  await supabaseTableRequest<AdminSaleItemRow[]>(`/admin_sale_items?sale_id=eq.${encodeURIComponent(saleId)}`, {
    method: "DELETE",
  });

  if (!items.length) return;

  await supabaseTableRequest<AdminSaleItemRow[]>("/admin_sale_items", {
    method: "POST",
    body: JSON.stringify(items.map((item) => compact(saleItemToRow(saleId, item)))),
  });
}

export async function deleteSale(id: string) {
  const rows = await supabaseTableRequest<AdminSaleRow[]>(`/admin_sales?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return rows.length > 0;
}

export async function listInventory() {
  const rows = await supabaseTableRequest<AdminInventoryRow[]>("/admin_inventory_items?select=*&order=sku.asc");
  const syncedRows = await syncCatalogInventoryRows(enrichRowsWithCatalogMetadata(rows));
  return syncedRows.sort((a, b) => a.sku.localeCompare(b.sku)).map(inventoryFromRow);
}

export async function listInventoryProducts(): Promise<AdminInventoryProduct[]> {
  const variants = await listInventory();
  const groups = new Map<string, AdminInventoryProduct>();

  for (const variant of variants) {
    const parentSku = variant.parentSku || variant.sku.split("-").slice(0, 2).join("-");
    const existing =
      groups.get(parentSku) ??
      {
        productId: variant.productId,
        parentSku,
        product: variant.product,
        summary: variant.summary,
        description: variant.description,
        category: variant.category,
        collection: variant.collection,
        subcollection: variant.subcollection ?? deriveSubcollection(variant.product, variant.collection),
        images: variant.image ? [variant.image] : [],
        basePrice: variant.price,
        status: variant.status ?? "active",
        totalOnHand: 0,
        totalReserved: 0,
        totalSold: 0,
        totalAvailable: 0,
        variants: [],
      };

    const available = Math.max(0, variant.onHand - variant.reserved);
    existing.totalOnHand += variant.onHand;
    existing.totalReserved += variant.reserved;
    existing.totalSold += variant.sold ?? 0;
    existing.totalAvailable += available;
    existing.variants.push(variant);

    if (variant.image && !existing.images.includes(variant.image)) {
      existing.images.push(variant.image);
    }
    if ((variant.status ?? "active") === "active") {
      existing.status = "active";
    }

    groups.set(parentSku, existing);
  }

  return Array.from(groups.values()).sort((a, b) => a.parentSku.localeCompare(b.parentSku));
}

export async function listProductStock(): Promise<ProductStockMap> {
  const rows = await supabaseTableRequest<AdminInventoryRow[]>(
    "/admin_inventory_items?select=sku,product_id,color,size,on_hand,reserved,status&order=sku.asc"
  );
  const stockMap: ProductStockMap = {};

  for (const row of rows) {
    if (!row.product_id) continue;

    const available = row.status === "active" ? Math.max(0, row.on_hand - row.reserved) : 0;
    const existing: ProductStock =
      stockMap[row.product_id] ??
      {
        productId: row.product_id,
        available: 0,
        variants: [],
      };

    existing.available += available;
    existing.variants.push({
      sku: row.sku,
      color: row.color ?? undefined,
      size: row.size ?? undefined,
      available,
      status: row.status ?? "active",
    });

    stockMap[row.product_id] = existing;
  }

  return stockMap;
}

export async function createInventoryItem(input: AdminInventoryItem) {
  const [row] = await supabaseTableRequest<AdminInventoryRow[]>("/admin_inventory_items", {
    method: "POST",
    body: JSON.stringify([
      {
        sku: input.sku,
        parent_sku: input.parentSku,
        product_id: input.productId,
        product: input.product,
        summary: input.summary,
        description: input.description,
        category: input.category,
        collection: input.collection,
        color: input.color,
        size: input.size,
        options: input.options,
        price: input.price,
        image: input.image,
        on_hand: input.onHand,
        reserved: input.reserved,
        sold: input.sold ?? 0,
        low_stock_threshold: input.lowStockThreshold ?? 3,
        status: input.status ?? "active",
        warehouse: input.warehouse,
      },
    ]),
  });

  return inventoryFromRow(row);
}

async function nextInventoryProductId() {
  const rows = await supabaseTableRequest<Array<{ product_id: number | null }>>(
    "/admin_inventory_items?select=product_id&product_id=not.is.null&order=product_id.desc&limit=1"
  );

  return (rows[0]?.product_id ?? 0) + 1;
}

export async function upsertInventoryProduct(input: AdminInventoryProductInput) {
  const productId = input.productId ?? (await nextInventoryProductId());
  const collection = input.collection || input.category || "Producto";
  const parentSku = input.parentSku || productPrefix({ id: productId, collection });
  const colors = input.colors.length ? input.colors : ["UNICO"];
  const sizes = input.sizes.length ? input.sizes : ["STD"];
  const existingRows = await supabaseTableRequest<AdminInventoryRow[]>(
    `/admin_inventory_items?parent_sku=eq.${encodeURIComponent(parentSku)}&select=*`
  );
  const existingBySku = new Map(existingRows.map((row) => [row.sku, row]));
  const nextSkus = new Set<string>();

  const rows = colors.flatMap((color) =>
    sizes.map((size) => {
      const sku = variantSku(parentSku, color, size);
      const existing = existingBySku.get(sku);
      const price = input.sizePrices?.[size] ?? input.basePrice;
      const stock = input.sizeStocks?.[size] ?? input.defaultStock ?? 0;
      nextSkus.add(sku);

      return {
        sku,
        parent_sku: parentSku,
        product_id: productId,
        product: input.product,
        summary: input.summary,
        description: input.description,
        category: input.category,
        collection,
        subcollection: input.subcollection || deriveSubcollection(input.product, collection),
        color,
        size,
        options: { color, size },
        price,
        image: input.image,
        on_hand: existing?.on_hand ?? stock,
        reserved: existing?.reserved ?? 0,
        sold: existing?.sold ?? 0,
        low_stock_threshold: input.lowStockThreshold ?? existing?.low_stock_threshold ?? 3,
        status: input.status ?? existing?.status ?? "active",
        warehouse: input.warehouse ?? existing?.warehouse ?? "Principal",
      };
    })
  );

  await supabaseTableRequest<AdminInventoryRow[]>("/admin_inventory_items?on_conflict=sku", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  const removedRows = existingRows.filter((row) => !nextSkus.has(row.sku));
  await Promise.all(
    removedRows.map((row) =>
      supabaseTableRequest<AdminInventoryRow[]>(`/admin_inventory_items?sku=eq.${encodeURIComponent(row.sku)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "archived" }),
      })
    )
  );

  const products = await listInventoryProducts();
  return products.find((product) => product.parentSku === parentSku) ?? null;
}

export async function updateInventoryItem(sku: string, patch: Partial<Omit<AdminInventoryItem, "sku">>) {
  const rows = await supabaseTableRequest<AdminInventoryRow[]>(`/admin_inventory_items?sku=eq.${encodeURIComponent(sku)}`, {
    method: "PATCH",
    body: JSON.stringify(
      compact({
        product: patch.product,
        parent_sku: patch.parentSku,
        product_id: patch.productId,
        summary: patch.summary,
        description: patch.description,
        category: patch.category,
        collection: patch.collection,
        subcollection: patch.subcollection,
        color: patch.color,
        size: patch.size,
        options: patch.options,
        price: patch.price,
        image: patch.image,
        on_hand: patch.onHand,
        reserved: patch.reserved,
        sold: patch.sold,
        low_stock_threshold: patch.lowStockThreshold,
        status: patch.status,
        warehouse: patch.warehouse,
      })
    ),
  });

  return rows[0] ? inventoryFromRow(rows[0]) : null;
}

export async function deleteInventoryItem(sku: string) {
  const rows = await supabaseTableRequest<AdminInventoryRow[]>(`/admin_inventory_items?sku=eq.${encodeURIComponent(sku)}`, {
    method: "DELETE",
  });

  return rows.length > 0;
}

export async function listContacts() {
  const rows = await supabaseTableRequest<AdminContactRow[]>("/admin_contacts?select=*&order=id.desc");
  return rows.map(contactFromRow);
}

export async function listCustomerInsights() {
  const [contacts, sales] = await Promise.all([listContacts(), listSales()]);
  const customers = contacts.map<AdminCustomerInsight>((contact) => {
    const customerSales = sales.filter((sale) => contactMatchesSale(contact, sale));
    const sortedSales = [...customerSales].sort((a, b) => {
      const left = a.placedAt ? new Date(a.placedAt).getTime() : 0;
      const right = b.placedAt ? new Date(b.placedAt).getTime() : 0;
      return right - left;
    });
    const latestSale = sortedSales[0];

    return {
      id: contact.id,
      name: contact.client,
      document: contact.document,
      phone: contact.cellphone,
      email: contact.email,
      type: contact.classification,
      district: contact.district,
      province: contact.province,
      department: contact.department,
      address: [contact.address, contact.addressNumber, contact.reference].filter(Boolean).join(" "),
      agency: contact.agency,
      orderCount: customerSales.length,
      saleCount: customerSales.length,
      ltv: customerSales.reduce((sum, sale) => sum + sale.amount, 0),
      lastPurchase: latestSaleDate(customerSales),
      lastSaleStatus: latestSale?.status,
    };
  });

  const orphanSales = sales.filter((sale) => !contacts.some((contact) => contactMatchesSale(contact, sale)));
  const orphanCustomers = orphanSales.map<AdminCustomerInsight>((sale) => ({
    id: sale.customerId || sale.customerDni || sale.customer,
    name: sale.customer,
    document: sale.customerDni || "",
    phone: "",
    email: "",
    type: sale.customerType || "MINORISTA",
    district: "",
    province: "",
    department: "",
    address: sale.customerAddress || "",
    agency: "",
    orderCount: 1,
    saleCount: 1,
    ltv: sale.amount,
    lastPurchase: sale.placedAt,
    lastSaleStatus: sale.status,
  }));

  const mergedCustomers = [...customers, ...orphanCustomers].sort((a, b) => b.ltv - a.ltv || a.name.localeCompare(b.name));

  return {
    customers: mergedCustomers,
    summary: customerSummary(mergedCustomers),
  };
}

export async function createContact(input: Omit<AdminContact, "id">) {
  const [row] = await supabaseTableRequest<AdminContactRow[]>("/admin_contacts", {
    method: "POST",
    body: JSON.stringify([compact(contactToRow(input))]),
  });

  return contactFromRow(row);
}

export async function updateContact(id: string, patch: Partial<Omit<AdminContact, "id">>) {
  const rows = await supabaseTableRequest<AdminContactRow[]>(`/admin_contacts?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(compact(contactToRow(patch))),
  });

  return rows[0] ? contactFromRow(rows[0]) : null;
}

export async function deleteContact(id: string) {
  const rows = await supabaseTableRequest<AdminContactRow[]>(`/admin_contacts?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return rows.length > 0;
}
