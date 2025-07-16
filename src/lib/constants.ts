import { InvoiceStatus } from '@/types'

// Invoice Status Configuration
export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, {
  label: string
  color: string
  bgColor: string
  textColor: string
}> = {
  draft: {
    label: '임시저장',
    color: 'bg-gray-100 text-gray-800',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  pending: {
    label: '승인대기',
    color: 'bg-yellow-100 text-yellow-800',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  issued: {
    label: '발행완료',
    color: 'bg-blue-100 text-blue-800',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  paid: {
    label: '결제완료',
    color: 'bg-green-100 text-green-800',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  overdue: {
    label: '연체',
    color: 'bg-red-100 text-red-800',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
}

// Stock Status Configuration
export const STOCK_STATUS_CONFIG = {
  in_stock: {
    label: '재고 충분',
    color: 'bg-green-100 text-green-800',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  low_stock: {
    label: '재고 부족',
    color: 'bg-yellow-100 text-yellow-800',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  out_of_stock: {
    label: '재고 없음',
    color: 'bg-red-100 text-red-800',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
} as const

// Priority Configuration
export const PRIORITY_CONFIG = {
  low: {
    label: '낮음',
    color: 'bg-gray-100 text-gray-800',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800'
  },
  medium: {
    label: '보통',
    color: 'bg-blue-100 text-blue-800',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  high: {
    label: '높음',
    color: 'bg-orange-100 text-orange-800',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800'
  },
  urgent: {
    label: '긴급',
    color: 'bg-red-100 text-red-800',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
} as const

// Business Rules
export const BUSINESS_RULES = {
  VAT_RATE: 0.1, // 10% VAT
  MIN_STOCK_THRESHOLD: 10,
  MAX_ITEMS_PER_INVOICE: 100,
  INVOICE_NUMBER_PREFIX: 'INV-',
  BUSINESS_NUMBER_PATTERN: /^\d{3}-\d{2}-\d{5}$/,
  PHONE_NUMBER_PATTERN: /^01[016789]-\d{3,4}-\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

// API Endpoints
export const API_ENDPOINTS = {
  SALES: '/api/sales',
  PURCHASE: '/api/purchase',
  INVENTORY: '/api/inventory',
  AUTH: '/api/auth',
  NTS: '/api/nts',
} as const

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: '필수 입력 항목입니다',
  INVALID_BUSINESS_NUMBER: '올바른 사업자번호를 입력하세요 (예: 123-45-67890)',
  INVALID_PHONE: '올바른 전화번호를 입력하세요 (예: 010-1234-5678)',
  INVALID_EMAIL: '올바른 이메일 주소를 입력하세요',
  MIN_LENGTH: (min: number) => `최소 ${min}자 이상 입력하세요`,
  MAX_LENGTH: (max: number) => `최대 ${max}자까지 입력 가능합니다`,
  POSITIVE_NUMBER: '0보다 큰 숫자를 입력하세요',
  INVALID_DATE: '올바른 날짜를 입력하세요',
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD',
  DISPLAY_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  API: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  FILE_NAME: 'YYYYMMDD_HHmmss',
} as const

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_SEARCH_RESULTS: 1000,
} as const

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
} as const

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 256, // 16rem in pixels
  HEADER_HEIGHT: 64, // 4rem in pixels
  MOBILE_BREAKPOINT: 768,
  TOAST_DURATION: 3000,
} as const

// Colors (for programmatic use)
export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const