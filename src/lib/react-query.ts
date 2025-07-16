import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

// React Query 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // 401 에러 (인증 오류)는 재시도하지 않음
        if (error?.status === 401) return false
        // 최대 3번까지 재시도
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: (error: any) => {
        console.error('Mutation error:', error)
        toast.error(error.message || '오류가 발생했습니다.')
      },
      onSuccess: () => {
        // 성공 시 관련 쿼리 무효화
        queryClient.invalidateQueries()
      },
    },
  },
})

// Query Keys 상수
export const QUERY_KEYS = {
  // Auth
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
  // Sales
  sales: {
    all: ['sales'],
    lists: () => [...QUERY_KEYS.sales.all, 'list'],
    list: (filters?: any) => [...QUERY_KEYS.sales.lists(), filters],
    details: () => [...QUERY_KEYS.sales.all, 'detail'],
    detail: (id: string) => [...QUERY_KEYS.sales.details(), id],
    stats: (dateFrom?: string, dateTo?: string) => [...QUERY_KEYS.sales.all, 'stats', dateFrom, dateTo],
  },
  // Purchase
  purchase: {
    all: ['purchase'],
    lists: () => [...QUERY_KEYS.purchase.all, 'list'],
    list: (filters?: any) => [...QUERY_KEYS.purchase.lists(), filters],
    details: () => [...QUERY_KEYS.purchase.all, 'detail'],
    detail: (id: string) => [...QUERY_KEYS.purchase.details(), id],
    stats: (dateFrom?: string, dateTo?: string) => [...QUERY_KEYS.purchase.all, 'stats', dateFrom, dateTo],
  },
  // Inventory
  inventory: {
    all: ['inventory'],
    lists: () => [...QUERY_KEYS.inventory.all, 'list'],
    list: (filters?: any) => [...QUERY_KEYS.inventory.lists(), filters],
    details: () => [...QUERY_KEYS.inventory.all, 'detail'],
    detail: (id: string) => [...QUERY_KEYS.inventory.details(), id],
    stats: () => [...QUERY_KEYS.inventory.all, 'stats'],
  },
  // Customers
  customers: {
    all: ['customers'],
    lists: () => [...QUERY_KEYS.customers.all, 'list'],
    list: (filters?: any) => [...QUERY_KEYS.customers.lists(), filters],
    details: () => [...QUERY_KEYS.customers.all, 'detail'],
    detail: (id: string) => [...QUERY_KEYS.customers.details(), id],
  },
  // Suppliers
  suppliers: {
    all: ['suppliers'],
    lists: () => [...QUERY_KEYS.suppliers.all, 'list'],
    list: (filters?: any) => [...QUERY_KEYS.suppliers.lists(), filters],
    details: () => [...QUERY_KEYS.suppliers.all, 'detail'],
    detail: (id: string) => [...QUERY_KEYS.suppliers.details(), id],
  },
}

// 에러 핸들러
export const handleQueryError = (error: any, customMessage?: string) => {
  console.error('Query error:', error)
  
  if (error?.status === 401) {
    toast.error('인증이 필요합니다. 다시 로그인해주세요.')
    // 로그인 페이지로 리다이렉트
    window.location.href = '/login'
    return
  }
  
  if (error?.status === 403) {
    toast.error('접근 권한이 없습니다.')
    return
  }
  
  const message = customMessage || error?.message || '오류가 발생했습니다.'
  toast.error(message)
}

// 성공 핸들러
export const handleMutationSuccess = (message: string, invalidateQueries?: string[][]) => {
  toast.success(message)
  
  if (invalidateQueries) {
    invalidateQueries.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey })
    })
  }
}

// 일반적인 쿼리 옵션
export const getQueryOptions = (queryKey: string[], enabled: boolean = true) => ({
  queryKey,
  enabled,
  onError: handleQueryError,
  select: (data: any) => data,
})

// 일반적인 뮤테이션 옵션
export const getMutationOptions = (
  successMessage: string,
  invalidateQueries?: string[][],
  onSuccess?: (data: any) => void
) => ({
  onSuccess: (data: any) => {
    handleMutationSuccess(successMessage, invalidateQueries)
    onSuccess?.(data)
  },
  onError: handleQueryError,
})

// 데이터 미리 로드 유틸리티
export const prefetchQuery = async (queryKey: string[], queryFn: () => Promise<any>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// 무효화 유틸리티
export const invalidateQueries = (queryKeys: string[][]) => {
  queryKeys.forEach(queryKey => {
    queryClient.invalidateQueries({ queryKey })
  })
}

// 특정 쿼리 데이터 가져오기
export const getQueryData = (queryKey: string[]) => {
  return queryClient.getQueryData(queryKey)
}

// 쿼리 데이터 설정
export const setQueryData = (queryKey: string[], data: any) => {
  queryClient.setQueryData(queryKey, data)
}

// 캐시 클리어
export const clearCache = () => {
  queryClient.clear()
}

// 오프라인 상태 처리
export const handleOfflineState = () => {
  const isOnline = navigator.onLine
  
  if (!isOnline) {
    toast.error('인터넷 연결을 확인해주세요.')
    return false
  }
  
  return true
}

// 리트라이 설정
export const retryConfig = {
  retry: (failureCount: number, error: any) => {
    if (error?.status === 401 || error?.status === 403) {
      return false
    }
    return failureCount < 3
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
}

// 무한 스크롤을 위한 설정
export const infiniteQueryConfig = {
  getNextPageParam: (lastPage: any) => {
    const { page, pageSize, total } = lastPage
    const hasNextPage = page * pageSize < total
    return hasNextPage ? page + 1 : undefined
  },
  getPreviousPageParam: (firstPage: any) => {
    return firstPage.page > 1 ? firstPage.page - 1 : undefined
  },
}

export default queryClient