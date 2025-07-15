import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'yyyy-MM-dd', { locale: ko })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'yyyy-MM-dd HH:mm', { locale: ko })
}

export function generateInvoiceNumber(prefix: string): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${prefix}${year}${month}${day}${random}`
}

export function generateProductCode(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `P${timestamp}${random}`.toUpperCase()
}

export function validateBusinessNumber(businessNumber: string): boolean {
  // 사업자등록번호 유효성 검사 (간단한 형식 검사)
  const cleaned = businessNumber.replace(/[^0-9]/g, '')
  if (cleaned.length !== 10) return false
  
  // 체크섬 계산
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
  let sum = 0
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i]
  }
  
  const remainder = sum % 10
  const checkDigit = remainder === 0 ? 0 : 10 - remainder
  
  return checkDigit === parseInt(cleaned[9])
}

export function calculateTax(amount: number, taxRate: number = 0.1): number {
  return Math.round(amount * taxRate)
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}