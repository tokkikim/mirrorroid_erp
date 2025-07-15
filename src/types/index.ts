export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'accounting'
  created_at: string
  updated_at: string
}

export interface SalesInvoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_business_number: string
  customer_address: string
  customer_phone: string
  customer_email: string
  items: InvoiceItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  status: 'draft' | 'pending' | 'issued' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
  payment_date?: string
  nts_status: 'pending' | 'issued' | 'failed'
  nts_issue_date?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface PurchaseInvoice {
  id: string
  invoice_number: string
  supplier_name: string
  supplier_business_number: string
  supplier_address: string
  supplier_phone: string
  supplier_email: string
  items: InvoiceItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  status: 'draft' | 'pending' | 'received' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
  received_date?: string
  payment_date?: string
  nts_status: 'pending' | 'verified' | 'not_found'
  nts_check_date?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  product_name: string
  product_code: string
  quantity: number
  unit_price: number
  total_price: number
  description?: string
}

export interface InventoryItem {
  id: string
  product_code: string
  product_name: string
  category: string
  unit: string
  current_stock: number
  minimum_stock: number
  unit_price: number
  location: string
  supplier: string
  status: 'active' | 'inactive' | 'discontinued'
  last_updated: string
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: string
  product_id: string
  product_name: string
  product_code: string
  movement_type: 'in' | 'out' | 'adjustment'
  quantity: number
  unit_price: number
  total_amount: number
  reference_type: 'purchase' | 'sales' | 'adjustment' | 'return'
  reference_id?: string
  notes?: string
  created_by: string
  created_at: string
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  is_read: boolean
  created_at: string
  expires_at?: string
}

export interface DashboardStats {
  total_sales: number
  total_purchases: number
  pending_invoices: number
  low_stock_items: number
  monthly_sales: number
  monthly_purchases: number
  overdue_invoices: number
}

// Form types
export interface CreateSalesInvoiceForm {
  customer_name: string
  customer_business_number: string
  customer_address: string
  customer_phone: string
  customer_email: string
  items: InvoiceItemForm[]
  due_date: string
  notes?: string
}

export interface CreatePurchaseInvoiceForm {
  supplier_name: string
  supplier_business_number: string
  supplier_address: string
  supplier_phone: string
  supplier_email: string
  items: InvoiceItemForm[]
  due_date: string
  notes?: string
}

export interface InvoiceItemForm {
  product_name: string
  product_code: string
  quantity: number
  unit_price: number
  description?: string
}

export interface CreateInventoryItemForm {
  product_name: string
  category: string
  unit: string
  current_stock: number
  minimum_stock: number
  unit_price: number
  location: string
  supplier: string
}

export interface StockMovementForm {
  product_id: string
  movement_type: 'in' | 'out' | 'adjustment'
  quantity: number
  unit_price: number
  reference_type: 'purchase' | 'sales' | 'adjustment' | 'return'
  reference_id?: string
  notes?: string
}