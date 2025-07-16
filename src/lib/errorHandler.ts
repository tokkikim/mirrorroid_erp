import { ApiError } from '@/types'

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return '알 수 없는 오류가 발생했습니다'
}

export function createApiError(
  message: string,
  code: string,
  details?: any
): ApiError {
  return {
    message,
    code,
    details,
    timestamp: new Date().toISOString() as any
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error &&
    'timestamp' in error
  )
}

export function formatValidationErrors(errors: any[]): string {
  if (!Array.isArray(errors) || errors.length === 0) {
    return '유효하지 않은 입력입니다'
  }
  
  return errors.map(error => {
    if (typeof error === 'string') return error
    if (error && typeof error === 'object' && 'message' in error) {
      return error.message
    }
    return '유효하지 않은 입력입니다'
  }).join(', ')
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  
  return handleApiError(error)
}

export function logError(error: Error, context?: Record<string, any>): void {
  const logData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context: context || {},
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    url: typeof window !== 'undefined' ? window.location.href : 'N/A'
  }
  
  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData)
  }
  
  // 프로덕션 환경에서는 외부 서비스로 전송
  // 예: Sentry, LogRocket, DataDog 등
  // sendToLoggingService(logData)
}

export function withErrorBoundary<T extends any[], R>(
  fn: (...args: T) => R,
  fallback?: R
): (...args: T) => R {
  return (...args: T) => {
    try {
      return fn(...args)
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        functionName: fn.name,
        arguments: args
      })
      
      if (fallback !== undefined) {
        return fallback
      }
      
      throw error
    }
  }
}

export async function withAsyncErrorBoundary<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  fallback?: R
): Promise<(...args: T) => Promise<R>> {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        functionName: fn.name,
        arguments: args
      })
      
      if (fallback !== undefined) {
        return fallback
      }
      
      throw error
    }
  }
}

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean
  
  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    
    if (field) {
      this.message = `${field}: ${message}`
    }
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource}을(를) 찾을 수 없습니다`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = '인증이 필요합니다') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = '접근 권한이 없습니다') {
    super(message, 'FORBIDDEN', 403)
    this.name = 'ForbiddenError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = '네트워크 오류가 발생했습니다') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof NetworkError ||
    (error instanceof Error && error.name === 'NetworkError') ||
    (error instanceof Error && error.message.includes('네트워크')) ||
    (error instanceof Error && error.message.includes('network'))
  )
}

export function isValidationError(error: unknown): boolean {
  return (
    error instanceof ValidationError ||
    (error instanceof Error && error.name === 'ValidationError') ||
    (isApiError(error) && error.code === 'VALIDATION_ERROR')
  )
}

export function getErrorCode(error: unknown): string {
  if (error instanceof AppError) {
    return error.code
  }
  
  if (isApiError(error)) {
    return error.code
  }
  
  if (error instanceof Error) {
    return error.name
  }
  
  return 'UNKNOWN_ERROR'
}

export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode
  }
  
  return 500
}