import type { AdminContact, AdminInventoryItem, AdminOrder, AdminSale } from "@/lib/admin-data";

let sales: AdminSale[] = [
  { id: "VEN-1054", orderNumber: "VEN-1054", placedAt: new Date().toISOString().slice(0, 10), customerDni: "74251638", customerAddress: "Av. Larco 123, Miraflores", customerId: "CUS-001", customerType: "MINORISTA", channel: "online", customer: "Ana M.", amount: 140, status: "Pagado", currency: "SOLES", exchangeRate: 1, paymentStatus: "Pagado", source: "web", subtotal: 118.64, taxTotal: 21.36, shippingTotal: 0, discountTotal: 0, salesRepId: "USR-001" },
  { id: "VEN-1053", orderNumber: "VEN-1053", placedAt: new Date().toISOString().slice(0, 10), customerDni: "10478529", customerAddress: "Jr. Grau 456, Surco", customerId: "CUS-002", customerType: "MAYORISTA", channel: "pos", customer: "Mostrador", amount: 35, status: "Pagado", currency: "SOLES", exchangeRate: 1, paymentStatus: "Pagado", source: "store", subtotal: 29.66, taxTotal: 5.34, shippingTotal: 0, discountTotal: 0, salesRepId: "USR-001" },
  { id: "VEN-1052", orderNumber: "VEN-1052", placedAt: new Date().toISOString().slice(0, 10), customerDni: "76321498", customerAddress: "Av. Arequipa 789, Lince", customerId: "CUS-003", customerType: "MINORISTA", channel: "online", customer: "Juan T.", amount: 70, status: "Pendiente", currency: "SOLES", exchangeRate: 1, paymentStatus: "Pendiente", source: "web", subtotal: 59.32, taxTotal: 10.68, shippingTotal: 0, discountTotal: 0, salesRepId: "USR-002" },
  { id: "VEN-1051", orderNumber: "VEN-1051", placedAt: new Date().toISOString().slice(0, 10), customerDni: "40752136", customerAddress: "Calle 2 de Mayo 321, San Isidro", customerId: "CUS-004", customerType: "MAYORISTA", channel: "online", customer: "Maria L.", amount: 105, status: "Pagado", currency: "SOLES", exchangeRate: 1, paymentStatus: "Pagado", source: "instagram", subtotal: 88.98, taxTotal: 16.02, shippingTotal: 0, discountTotal: 0, salesRepId: "USR-003" },
];

let orders: AdminOrder[] = [
  { id: "ORD-9001", customer: "Carlos A.", total: 105, status: "Preparando" },
  { id: "ORD-9000", customer: "Rosa C.", total: 70, status: "Enviado" },
  { id: "ORD-8999", customer: "Luis P.", total: 35, status: "Entregado" },
  { id: "ORD-8998", customer: "Nora V.", total: 140, status: "Pendiente de pago" },
];

let inventory: AdminInventoryItem[] = [
  { sku: "POL-NEY-NEG-M", product: "Neymar v2", onHand: 4, reserved: 2, warehouse: "Principal" },
  { sku: "POL-CR7-BLA-S", product: "Cristiano v6", onHand: 18, reserved: 1, warehouse: "Principal" },
  { sku: "POL-MES-BLA-L", product: "Messi v7", onHand: 6, reserved: 0, warehouse: "Principal" },
  { sku: "POL-GYM-NEG-M", product: "Todo sea por las senoras", onHand: 2, reserved: 1, warehouse: "Principal" },
];

let contacts: AdminContact[] = [
  {
    id: "SUP-201",
    documentType: "DNI",
    document: "74251638",
    lastNamePaterno: "GARCIA",
    lastNameMaterno: "MORA",
    names: "ANA MARIA",
    sex: "FEMENINO",
    birthDate: "1994-05-12",
    numero: "01",
    classification: "MINORISTA",
    client: "GARCIA MORA ANA MARIA",
    cellphone: "987654321",
    email: "ANA.MARIA@GMAIL.COM",
    province: "LIMA",
    district: "MIRAFLORES",
    department: "LIMA",
    address: "AV. LARCO",
    addressNumber: "123",
    reference: "CERCA AL PARQUE",
    agency: "MIRAFLORES",
    contactedBy: ["WHATSAPP"],
  },
  {
    id: "SUP-200",
    documentType: "DNI",
    document: "10478529",
    lastNamePaterno: "PEREZ",
    lastNameMaterno: "GONZALES",
    names: "PEDRO JOSE",
    sex: "MASCULINO",
    birthDate: "1990-09-03",
    numero: "02",
    classification: "MINORISTA",
    client: "PEREZ GONZALES PEDRO JOSE",
    cellphone: "999888777",
    email: "PEDRO.PEREZ@GMAIL.COM",
    province: "LIMA",
    district: "SURCO",
    department: "LIMA",
    address: "JR. GRAU",
    addressNumber: "456",
    reference: "FRENTE AL COLEGIO",
    agency: "SURCO",
    contactedBy: ["EMAIL"],
  },
  {
    id: "SUP-199",
    documentType: "RUC",
    document: "20123456789",
    lastNamePaterno: "TIENDA",
    lastNameMaterno: "MIRAFLORES",
    names: "RAZON SOCIAL",
    sex: "OTRO",
    birthDate: "1988-01-20",
    numero: "03",
    classification: "MAYORISTA",
    client: "TIENDA MIRAFLORES RAZON SOCIAL",
    cellphone: "998776655",
    email: "VENTAS@TIENDAMIRAFLORES.COM",
    province: "LIMA",
    district: "MIRAFLORES",
    department: "LIMA",
    address: "AV. BENAVIDES",
    addressNumber: "789",
    reference: "LOCAL EN ESQUINA",
    agency: "MIRAFLORES",
    contactedBy: ["FORMULARIO"],
  },
];

let salesCounter = 1055;
let ordersCounter = 9002;
let contactsCounter = 202;

function nextSalesId() {
  const value = salesCounter;
  salesCounter += 1;
  return `VEN-${value}`;
}

function nextOrdersId() {
  const value = ordersCounter;
  ordersCounter += 1;
  return `ORD-${value}`;
}

function nextContactId() {
  const value = contactsCounter;
  contactsCounter += 1;
  return `SUP-${value}`;
}

export function listSales() {
  return [...sales].sort((a, b) => b.id.localeCompare(a.id));
}

export function createSale(input: Omit<AdminSale, "id">) {
  const nextId = nextSalesId();
  const newSale: AdminSale = { ...input, id: nextId, orderNumber: input.orderNumber || nextId };
  sales = [newSale, ...sales];
  return newSale;
}

export function updateSale(id: string, patch: Partial<Omit<AdminSale, "id">>) {
  const index = sales.findIndex((sale) => sale.id === id);
  if (index === -1) return null;

  sales[index] = { ...sales[index], ...patch };
  return sales[index];
}

export function deleteSale(id: string) {
  const initialLength = sales.length;
  sales = sales.filter((sale) => sale.id !== id);
  return sales.length < initialLength;
}

export function listOrders() {
  return [...orders].sort((a, b) => b.id.localeCompare(a.id));
}

export function createOrder(input: Omit<AdminOrder, "id">) {
  const newOrder: AdminOrder = { ...input, id: nextOrdersId() };
  orders = [newOrder, ...orders];
  return newOrder;
}

export function updateOrder(id: string, patch: Partial<Omit<AdminOrder, "id">>) {
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;

  orders[index] = { ...orders[index], ...patch };
  return orders[index];
}

export function deleteOrder(id: string) {
  const initialLength = orders.length;
  orders = orders.filter((order) => order.id !== id);
  return orders.length < initialLength;
}

export function listInventory() {
  return [...inventory].sort((a, b) => a.sku.localeCompare(b.sku));
}

export function createInventoryItem(input: AdminInventoryItem) {
  const exists = inventory.some((item) => item.sku === input.sku);
  if (exists) {
    return null;
  }

  inventory = [...inventory, input];
  return input;
}

export function updateInventoryItem(sku: string, patch: Partial<Omit<AdminInventoryItem, "sku">>) {
  const index = inventory.findIndex((item) => item.sku === sku);
  if (index === -1) return null;

  inventory[index] = { ...inventory[index], ...patch };
  return inventory[index];
}

export function deleteInventoryItem(sku: string) {
  const initialLength = inventory.length;
  inventory = inventory.filter((item) => item.sku !== sku);
  return inventory.length < initialLength;
}

export function listContacts() {
  return [...contacts].sort((a, b) => b.id.localeCompare(a.id));
}

export function createContact(input: Omit<AdminContact, "id">) {
  const newContact: AdminContact = { ...input, id: nextContactId() };
  contacts = [newContact, ...contacts];
  return newContact;
}

export function updateContact(id: string, patch: Partial<Omit<AdminContact, "id">>) {
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...patch };
  return contacts[index];
}

export function deleteContact(id: string) {
  const initialLength = contacts.length;
  contacts = contacts.filter((contact) => contact.id !== id);
  return contacts.length < initialLength;
}
