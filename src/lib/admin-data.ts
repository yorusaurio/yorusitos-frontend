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
}

export interface AdminOrder {
  id: string;
  customer: string;
  total: number;
  status: "Preparando" | "Enviado" | "Entregado" | "Pendiente de pago" | "Cancelado";
}

export interface AdminInventoryItem {
  sku: string;
  product: string;
  onHand: number;
  reserved: number;
  warehouse: string;
}

export interface AdminContact {
  id: string;
  name: string;
  channel: "WhatsApp" | "Email" | "Formulario";
  issue: string;
  priority: "Alta" | "Media" | "Baja";
  status: "Abierto" | "En proceso" | "Cerrado";
}
