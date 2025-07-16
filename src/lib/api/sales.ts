import { supabase, handleSupabaseError } from '@/lib/supabase'
import { Database } from '@/types/database'

export type SalesInvoice = Database['public']['Tables']['sales_invoices']['Row']
export type SalesInvoiceInsert = Database['public']['Tables']['sales_invoices']['Insert']
export type SalesInvoiceUpdate = Database['public']['Tables']['sales_invoices']['Update']
export type SalesInvoiceItem = Database['public']['Tables']['sales_invoice_items']['Row']
export type SalesInvoiceItemInsert = Database['public']['Tables']['sales_invoice_items']['Insert']

export interface SalesInvoiceWithItems extends SalesInvoice {
  items: SalesInvoiceItem[]
  customer?: {
    id: string
    name: string
    business_number: string
    representative: string
  }
}

export interface CreateSalesInvoiceData {
  customer_id: string
  issue_date: string
  due_date: string
  notes?: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
  }>
}

export interface SalesInvoiceFilters {
  status?: 'draft' | 'pending' | 'approved' | 'issued' | 'paid'
  customer_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface SalesInvoiceListResponse {
  data: SalesInvoiceWithItems[]
  total: number
  page: number
  pageSize: number
}

// 매출 계산서 목록 조회
export const getSalesInvoices = async (
  filters: SalesInvoiceFilters = {},
  page: number = 1,
  pageSize: number = 10
): Promise<SalesInvoiceListResponse> => {
  try {
    let query = supabase
      .from('sales_invoices')
      .select(`
        *,
        customer:customers(id, name, business_number, representative),
        items:sales_invoice_items(*)
      `)

    // 필터 적용
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.customer_id) {
      query = query.eq('customer_id', filters.customer_id)
    }

    if (filters.date_from) {
      query = query.gte('issue_date', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('issue_date', filters.date_to)
    }

    if (filters.search) {
      query = query.or(`invoice_number.ilike.%${filters.search}%,notes.ilike.%${filters.search}%`)
    }

    // 페이지네이션
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as SalesInvoiceWithItems[],
      total: count || 0,
      page,
      pageSize,
    }
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 매출 계산서 상세 조회
export const getSalesInvoiceById = async (id: string): Promise<SalesInvoiceWithItems> => {
  try {
    const { data, error } = await supabase
      .from('sales_invoices')
      .select(`
        *,
        customer:customers(id, name, business_number, representative),
        items:sales_invoice_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return data as SalesInvoiceWithItems
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 매출 계산서 생성
export const createSalesInvoice = async (
  data: CreateSalesInvoiceData,
  userId: string
): Promise<SalesInvoiceWithItems> => {
  try {
    // 금액 계산
    const subtotal = data.items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price),
      0
    )
    const taxAmount = Math.round(subtotal * 0.1)
    const totalAmount = subtotal + taxAmount

    // 계산서 번호 생성
    const invoiceNumber = await generateInvoiceNumber()

    // 트랜잭션 시작
    const { data: invoice, error: invoiceError } = await supabase
      .from('sales_invoices')
      .insert({
        invoice_number: invoiceNumber,
        customer_id: data.customer_id,
        issue_date: data.issue_date,
        due_date: data.due_date,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        status: 'draft',
        notes: data.notes,
        created_by: userId,
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // 계산서 항목 생성
    const invoiceItems = data.items.map((item) => ({
      invoice_id: invoice.id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }))

    const { data: items, error: itemsError } = await supabase
      .from('sales_invoice_items')
      .insert(invoiceItems)
      .select()

    if (itemsError) throw itemsError

    // 전체 데이터 조회
    return await getSalesInvoiceById(invoice.id)
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 매출 계산서 수정
export const updateSalesInvoice = async (
  id: string,
  data: Partial<CreateSalesInvoiceData>
): Promise<SalesInvoiceWithItems> => {
  try {
    const updateData: Partial<SalesInvoiceUpdate> = {}

    if (data.customer_id) updateData.customer_id = data.customer_id
    if (data.issue_date) updateData.issue_date = data.issue_date
    if (data.due_date) updateData.due_date = data.due_date
    if (data.notes !== undefined) updateData.notes = data.notes

    // 항목이 변경된 경우 금액 재계산
    if (data.items) {
      const subtotal = data.items.reduce(
        (sum, item) => sum + (item.quantity * item.unit_price),
        0
      )
      const taxAmount = Math.round(subtotal * 0.1)
      const totalAmount = subtotal + taxAmount

      updateData.subtotal = subtotal
      updateData.tax_amount = taxAmount
      updateData.total_amount = totalAmount

      // 기존 항목 삭제
      const { error: deleteError } = await supabase
        .from('sales_invoice_items')
        .delete()
        .eq('invoice_id', id)

      if (deleteError) throw deleteError

      // 새 항목 추가
      const invoiceItems = data.items.map((item) => ({
        invoice_id: id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }))

      const { error: itemsError } = await supabase
        .from('sales_invoice_items')
        .insert(invoiceItems)

      if (itemsError) throw itemsError
    }

    // 계산서 정보 업데이트
    const { error: updateError } = await supabase
      .from('sales_invoices')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) throw updateError

    return await getSalesInvoiceById(id)
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 매출 계산서 삭제 (소프트 삭제)
export const deleteSalesInvoice = async (id: string): Promise<void> => {
  try {
    // 임시저장 상태인 경우에만 삭제 가능
    const { data: invoice, error: checkError } = await supabase
      .from('sales_invoices')
      .select('status')
      .eq('id', id)
      .single()

    if (checkError) throw checkError

    if (invoice.status !== 'draft') {
      throw new Error('임시저장 상태의 계산서만 삭제할 수 있습니다.')
    }

    // 계산서 항목 삭제
    const { error: itemsError } = await supabase
      .from('sales_invoice_items')
      .delete()
      .eq('invoice_id', id)

    if (itemsError) throw itemsError

    // 계산서 삭제
    const { error: invoiceError } = await supabase
      .from('sales_invoices')
      .delete()
      .eq('id', id)

    if (invoiceError) throw invoiceError
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 매출 계산서 상태 변경
export const updateSalesInvoiceStatus = async (
  id: string,
  status: 'draft' | 'pending' | 'approved' | 'issued' | 'paid'
): Promise<SalesInvoiceWithItems> => {
  try {
    const { error } = await supabase
      .from('sales_invoices')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    return await getSalesInvoiceById(id)
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 계산서 번호 생성
const generateInvoiceNumber = async (): Promise<string> => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const prefix = `S${year}${month}`

  // 해당 월의 마지막 계산서 번호 조회
  const { data, error } = await supabase
    .from('sales_invoices')
    .select('invoice_number')
    .like('invoice_number', `${prefix}%`)
    .order('invoice_number', { ascending: false })
    .limit(1)

  if (error) throw error

  let nextNumber = 1
  if (data && data.length > 0) {
    const lastNumber = parseInt(data[0].invoice_number.slice(-4))
    nextNumber = lastNumber + 1
  }

  return `${prefix}${String(nextNumber).padStart(4, '0')}`
}

// 매출 통계 조회
export const getSalesStats = async (
  dateFrom?: string,
  dateTo?: string
): Promise<{
  totalAmount: number
  totalCount: number
  paidAmount: number
  pendingAmount: number
  statusCounts: Record<string, number>
}> => {
  try {
    let query = supabase
      .from('sales_invoices')
      .select('total_amount, status')

    if (dateFrom) {
      query = query.gte('issue_date', dateFrom)
    }

    if (dateTo) {
      query = query.lte('issue_date', dateTo)
    }

    const { data, error } = await query

    if (error) throw error

    const stats = data.reduce(
      (acc, invoice) => {
        acc.totalAmount += invoice.total_amount
        acc.totalCount += 1
        
        if (invoice.status === 'paid') {
          acc.paidAmount += invoice.total_amount
        } else {
          acc.pendingAmount += invoice.total_amount
        }

        acc.statusCounts[invoice.status] = (acc.statusCounts[invoice.status] || 0) + 1

        return acc
      },
      {
        totalAmount: 0,
        totalCount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        statusCounts: {} as Record<string, number>,
      }
    )

    return stats
  } catch (error) {
    throw handleSupabaseError(error)
  }
}