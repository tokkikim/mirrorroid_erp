import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { SalesInvoice, SearchParams, Sort, Filter } from '@/types'
import { handleApiError } from '@/lib/errorHandler'

// Mock data for now - replace with actual API calls
const mockSalesInvoices: SalesInvoice[] = [
  {
    id: 'sales-001' as any,
    invoice_number: 'INV-2024-001' as any,
    customer_name: '(주)테크솔루션',
    customer_business_number: '123-45-67890' as any,
    customer_address: '서울시 강남구 테헤란로 123',
    customer_phone: '02-1234-5678' as any,
    customer_email: 'contact@techsolution.com' as any,
    items: [
      {
        id: 'item-001' as any,
        product_name: '소프트웨어 라이선스',
        product_code: 'SW-001' as any,
        quantity: 1,
        unit_price: 1000000,
        total_price: 1000000,
        description: '연간 라이선스'
      }
    ],
    subtotal: 1000000,
    tax_amount: 100000,
    total_amount: 1100000,
    status: 'pending',
    issue_date: '2024-01-15' as any,
    due_date: '2024-02-15' as any,
    nts_status: 'pending',
    created_by: 'user-001' as any,
    created_at: '2024-01-15T09:00:00Z' as any,
    updated_at: '2024-01-15T09:00:00Z' as any
  }
]

export function useSalesInvoices() {
  const {
    salesInvoices,
    salesLoading,
    salesError,
    setSalesInvoices,
    addSalesInvoice,
    updateSalesInvoice,
    deleteSalesInvoice,
    setSalesLoading,
    setSalesError
  } = useStore()

  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    filters: [],
    sort: { field: 'created_at', order: 'desc' },
    pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 }
  })

  const fetchSalesInvoices = useCallback(async (params?: SearchParams) => {
    try {
      setSalesLoading(true)
      setSalesError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      // Apply filters, sorting, and pagination to mock data
      let filteredData = [...mockSalesInvoices]

      // Apply search
      if (params?.query) {
        filteredData = filteredData.filter(invoice =>
          invoice.customer_name.toLowerCase().includes(params.query!.toLowerCase()) ||
          invoice.invoice_number.toLowerCase().includes(params.query!.toLowerCase())
        )
      }

      // Apply filters
      if (params?.filters?.length) {
        params.filters.forEach(filter => {
          filteredData = filteredData.filter(invoice => {
            const value = invoice[filter.field as keyof SalesInvoice]
            switch (filter.operator) {
              case 'eq':
                return value === filter.value
              case 'contains':
                return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
              default:
                return true
            }
          })
        })
      }

      // Apply sorting
      if (params?.sort) {
        filteredData.sort((a, b) => {
          const aValue = a[params.sort!.field as keyof SalesInvoice]
          const bValue = b[params.sort!.field as keyof SalesInvoice]
          
          // Handle undefined values
          if (aValue === undefined || aValue === null) return 1
          if (bValue === undefined || bValue === null) return -1
          
          if (params.sort!.order === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }

      // Apply pagination
      const page = params?.pagination?.page || 1
      const pageSize = params?.pagination?.pageSize || 10
      const total = filteredData.length
      const totalPages = Math.ceil(total / pageSize)
      const startIndex = (page - 1) * pageSize
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

      setSalesInvoices(paginatedData)
      
      setSearchParams(prev => ({
        ...prev,
        ...params,
        pagination: {
          page,
          pageSize,
          total,
          totalPages
        }
      }))

    } catch (error) {
      setSalesError(handleApiError(error))
    } finally {
      setSalesLoading(false)
    }
  }, [setSalesInvoices, setSalesLoading, setSalesError])

  const createSalesInvoice = useCallback(async (data: Partial<SalesInvoice>) => {
    try {
      setSalesLoading(true)
      setSalesError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const newInvoice: SalesInvoice = {
        id: `sales-${Date.now()}` as any,
        invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}` as any,
        created_by: 'user-001' as any,
        created_at: new Date().toISOString() as any,
        updated_at: new Date().toISOString() as any,
        ...data
      } as SalesInvoice

      addSalesInvoice(newInvoice)
      
      return newInvoice
    } catch (error) {
      setSalesError(handleApiError(error))
      throw error
    } finally {
      setSalesLoading(false)
    }
  }, [addSalesInvoice, setSalesLoading, setSalesError])

  const updateSalesInvoiceById = useCallback(async (id: string, data: Partial<SalesInvoice>) => {
    try {
      setSalesLoading(true)
      setSalesError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      const updatedData = {
        ...data,
        updated_at: new Date().toISOString() as any
      }

      updateSalesInvoice(id, updatedData)
      
      return updatedData
    } catch (error) {
      setSalesError(handleApiError(error))
      throw error
    } finally {
      setSalesLoading(false)
    }
  }, [updateSalesInvoice, setSalesLoading, setSalesError])

  const deleteSalesInvoiceById = useCallback(async (id: string) => {
    try {
      setSalesLoading(true)
      setSalesError(null)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      deleteSalesInvoice(id)
    } catch (error) {
      setSalesError(handleApiError(error))
      throw error
    } finally {
      setSalesLoading(false)
    }
  }, [deleteSalesInvoice, setSalesLoading, setSalesError])

  const searchSalesInvoices = useCallback((query: string) => {
    const newParams = {
      ...searchParams,
      query,
      pagination: { ...searchParams.pagination!, page: 1 }
    }
    setSearchParams(newParams)
    fetchSalesInvoices(newParams)
  }, [searchParams, fetchSalesInvoices])

  const filterSalesInvoices = useCallback((filters: Filter[]) => {
    const newParams = {
      ...searchParams,
      filters,
      pagination: { ...searchParams.pagination!, page: 1 }
    }
    setSearchParams(newParams)
    fetchSalesInvoices(newParams)
  }, [searchParams, fetchSalesInvoices])

  const sortSalesInvoices = useCallback((sort: Sort) => {
    const newParams = {
      ...searchParams,
      sort
    }
    setSearchParams(newParams)
    fetchSalesInvoices(newParams)
  }, [searchParams, fetchSalesInvoices])

  const changePage = useCallback((page: number) => {
    const newParams = {
      ...searchParams,
      pagination: { ...searchParams.pagination!, page }
    }
    setSearchParams(newParams)
    fetchSalesInvoices(newParams)
  }, [searchParams, fetchSalesInvoices])

  // Load initial data
  useEffect(() => {
    fetchSalesInvoices(searchParams)
  }, []) // Only run once on mount

  return {
    // Data
    invoices: salesInvoices,
    loading: salesLoading,
    error: salesError,
    searchParams,
    
    // Actions
    fetchSalesInvoices,
    createSalesInvoice,
    updateSalesInvoice: updateSalesInvoiceById,
    deleteSalesInvoice: deleteSalesInvoiceById,
    searchSalesInvoices,
    filterSalesInvoices,
    sortSalesInvoices,
    changePage,
    
    // Utilities
    refresh: () => fetchSalesInvoices(searchParams),
    clearError: () => setSalesError(null)
  }
}