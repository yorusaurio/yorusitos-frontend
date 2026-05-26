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
