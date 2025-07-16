// Base types with stricter definitions
export type InvoiceStatus = 'draft' | 'pending' | 'issued' | 'paid' | 'overdue'
export type FilterStatus = InvoiceStatus | 'all'
export type PurchaseStatus = 'draft' | 'pending' | 'received' | 'paid' | 'overdue'
export type NtsStatus = 'pending' | 'issued' | 'failed' | 'verified' | 'not_found'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'
export type InventoryStatus = 'active' | 'inactive' | 'discontinued'
export type MovementType = 'in' | 'out' | 'adjustment'
export type ReferenceType = 'purchase' | 'sales' | 'adjustment' | 'return'
export type NotificationType = 'info' | 'warning' | 'error' | 'success'
export type UserRole = 'admin' | 'staff' | 'accounting'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

// Simplified types for better compatibility
export type BusinessNumber = string
export type PhoneNumber = string
export type EmailAddress = string
export type InvoiceNumber = string
export type ProductCode = string
export type UserId = string
export type EntityId = string

// Date types
export type ISODateString = string
export type DateOnly = string

// Utility types
export type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type SortOrder = 'asc' | 'desc'
export type SortField = string

export interface Sort {
  field: SortField
  order: SortOrder
}

export interface Filter {
  field: string
  value: string | number | boolean
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith'
}

export interface SearchParams {
  query?: string
  filters?: Filter[]
  sort?: Sort
  pagination?: Pagination
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

// Error types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  message: string
  code: string
  details?: any
  timestamp: ISODateString
}

// Entity types
export interface User {
  id: UserId
  email: EmailAddress
  name: string
  role: UserRole
  created_at: ISODateString
  updated_at: ISODateString
}

export interface SalesInvoice {
  id: EntityId
  invoice_number: InvoiceNumber
  customer_name: string
  customer_business_number: BusinessNumber
  customer_address: string
  customer_phone: PhoneNumber
  customer_email: EmailAddress
  items: InvoiceItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  status: InvoiceStatus
  issue_date: DateOnly
  due_date: DateOnly
  payment_date?: DateOnly
  nts_status: NtsStatus
  nts_issue_date?: DateOnly
  notes?: string
  created_by: UserId
  created_at: ISODateString
  updated_at: ISODateString
}

export interface PurchaseInvoice {
  id: EntityId
  invoice_number: InvoiceNumber
  supplier_name: string
  supplier_business_number: BusinessNumber
  supplier_address: string
  supplier_phone: PhoneNumber
  supplier_email: EmailAddress
  items: InvoiceItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  status: PurchaseStatus
  issue_date: DateOnly
  due_date: DateOnly
  received_date?: DateOnly
  payment_date?: DateOnly
  nts_status: NtsStatus
  nts_check_date?: DateOnly
  notes?: string
  created_by: UserId
  created_at: ISODateString
  updated_at: ISODateString
}

export interface InvoiceItem {
  id: EntityId
  product_name: string
  product_code: ProductCode
  quantity: number
  unit_price: number
  total_price: number
  description?: string
}

export interface InventoryItem {
  id: EntityId
  product_code: ProductCode
  product_name: string
  category: string
  unit: string
  current_stock: number
  minimum_stock: number
  unit_price: number
  location: string
  supplier: string
  status: InventoryStatus
  stock_status: StockStatus
  last_updated: ISODateString
  created_at: ISODateString
  updated_at: ISODateString
}

export interface StockMovement {
  id: EntityId
  product_id: EntityId
  product_name: string
  product_code: ProductCode
  movement_type: MovementType
  quantity: number
  unit_price: number
  total_amount: number
  reference_type: ReferenceType
  reference_id?: EntityId
  notes?: string
  created_by: UserId
  created_at: ISODateString
}

export interface Notification {
  id: EntityId
  type: NotificationType
  title: string
  message: string
  priority: Priority
  is_read: boolean
  created_at: ISODateString
  expires_at?: ISODateString
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

// Form types with validation
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
  movement_type: MovementType
  quantity: number
  unit_price: number
  reference_type: ReferenceType
  reference_id?: string
  notes?: string
}

// Component prop types
export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: Pagination
  onPageChange?: (page: number) => void
  onSortChange?: (sort: Sort) => void
  onRowClick?: (item: T) => void
  selectable?: boolean
  selectedItems?: T[]
  onSelectionChange?: (items: T[]) => void
}

export interface TableColumn<T> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  children: React.ReactNode
}

export interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  helpText?: string
  children: React.ReactNode
}

// Hook types
export interface UseApiOptions<T> {
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  retry?: number
  retryDelay?: number
}

export interface UseTableOptions<T> {
  data: T[]
  pageSize?: number
  initialSort?: Sort
  searchFields?: (keyof T)[]
}

// Service types
export interface ApiService<T> {
  getAll: (params?: SearchParams) => Promise<PaginatedResponse<T>>
  getById: (id: EntityId) => Promise<ApiResponse<T>>
  create: (data: Partial<T>) => Promise<ApiResponse<T>>
  update: (id: EntityId, data: Partial<T>) => Promise<ApiResponse<T>>
  delete: (id: EntityId) => Promise<ApiResponse<void>>
}

// Business logic types
export interface TaxCalculation {
  subtotal: number
  taxAmount: number
  total: number
  taxRate: number
}

export interface StockAlert {
  id: EntityId
  product_id: EntityId
  product_name: string
  current_stock: number
  minimum_stock: number
  alert_type: 'low_stock' | 'out_of_stock'
  created_at: ISODateString
}

export interface ReportParams {
  startDate: DateOnly
  endDate: DateOnly
  filters?: Filter[]
  groupBy?: string
  includeDetails?: boolean
}

// Audit log types
export interface AuditLog {
  id: EntityId
  user_id: UserId
  action: string
  entity_type: string
  entity_id: EntityId
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: ISODateString
}

// Configuration types
export interface AppConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'staging' | 'production'
  }
  database: {
    url: string
    pool_size: number
  }
  auth: {
    jwt_secret: string
    jwt_expiry: number
    refresh_token_expiry: number
  }
  nts: {
    api_url: string
    api_key: string
    test_mode: boolean
  }
}

// Type guards
export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return ['draft', 'pending', 'issued', 'paid', 'overdue'].includes(value)
}

export function isBusinessNumber(value: string): value is BusinessNumber {
  return /^\d{3}-\d{2}-\d{5}$/.test(value)
}

export function isPhoneNumber(value: string): value is PhoneNumber {
  return /^01[016789]-\d{3,4}-\d{4}$/.test(value)
}

export function isEmailAddress(value: string): value is EmailAddress {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}