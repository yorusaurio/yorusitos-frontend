export interface AdminSale {
  id: string;
  orderNumber?: string;
  placedAt?: string;
  customerId?: string;
  customerDni?: string;
  customerAddress?: string;
  channel: "online" | "pos" | "whatsapp";
  customer: string;
  customerType?: "MAYORISTA" | "MINORISTA";
  currency?: "SOLES" | "DOLARES";
  exchangeRate?: number;
  subtotal?: number;
  discountTotal?: number;
  shippingTotal?: number;
  taxTotal?: number;
  amount: number;
  paymentStatus?: "Pendiente" | "Pagado" | "Parcial";
  status: "Pagado" | "Pendiente" | "Anulado";
  source?: "web" | "instagram" | "whatsapp" | "store";
  notes?: string;
  salesRepId?: string;
  items?: AdminSaleItem[];
}

export interface AdminSaleItem {
  id?: string;
  saleId?: string;
  productId?: number;
  parentSku?: string;
  variantSku: string;
  product: string;
  description?: string;
  color?: string;
  size?: string;
  quantity: number;
  stockAvailable?: number;
  unitPrice: number;
  discountTotal: number;
  lineTotal: number;
}

export interface AdminInventoryItem {
  sku: string;
  parentSku?: string;
  productId?: number;
  product: string;
  description?: string;
  category?: string;
  collection?: string;
  color?: string;
  size?: string;
  options?: Record<string, string>;
  price?: number;
  image?: string;
  onHand: number;
  reserved: number;
  sold?: number;
  lowStockThreshold?: number;
  status?: "active" | "draft" | "archived";
  warehouse: string;
  updatedAt?: string;
}

export interface AdminInventoryProduct {
  productId?: number;
  parentSku: string;
  product: string;
  description?: string;
  category?: string;
  collection?: string;
  images: string[];
  basePrice?: number;
  status: "active" | "draft" | "archived";
  totalOnHand: number;
  totalReserved: number;
  totalSold: number;
  totalAvailable: number;
  variants: AdminInventoryItem[];
}

export interface AdminInventoryProductInput {
  productId?: number;
  parentSku?: string;
  product: string;
  description?: string;
  category?: string;
  collection?: string;
  image?: string;
  basePrice: number;
  colors: string[];
  sizes: string[];
  sizePrices?: Record<string, number>;
  sizeStocks?: Record<string, number>;
  defaultStock?: number;
  lowStockThreshold?: number;
  status?: "active" | "draft" | "archived";
  warehouse?: string;
}

export interface AdminContact {
  id: string;
  documentType: "DNI" | "CE" | "PASAPORTE" | "RUC" | "OTRO";
  document: string;
  lastNamePaterno: string;
  lastNameMaterno: string;
  names: string;
  sex: "MASCULINO" | "FEMENINO" | "OTRO";
  birthDate: string;
  numero: string;
  classification: "MINORISTA" | "MAYORISTA";
  client: string;
  cellphone: string;
  email: string;
  province: string;
  district: string;
  department: string;
  address: string;
  addressNumber: string;
  reference: string;
  agency: string;
  contactedBy: string[];
  contactedByOther?: string;
}

export interface AdminCustomerInsight {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  type: "MINORISTA" | "MAYORISTA";
  district: string;
  province: string;
  department: string;
  address: string;
  agency: string;
  orderCount: number;
  saleCount: number;
  ltv: number;
  lastPurchase?: string;
  lastSaleStatus?: AdminSale["status"];
}

export interface AdminCustomerSummary {
  total: number;
  newCustomers: number;
  recurrent: number;
  highValue: number;
  totalLtv: number;
}
