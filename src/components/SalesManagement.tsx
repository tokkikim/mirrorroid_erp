'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import SalesInvoiceForm from '@/components/SalesInvoiceForm'
import SalesInvoiceDetail from '@/components/SalesInvoiceDetail'
import { formatCurrency, formatDate } from '@/lib/utils'
import { SalesInvoice } from '@/types'
import toast from 'react-hot-toast'

// Mock data
const mockInvoices: SalesInvoice[] = [
  {
    id: '1',
    invoice_number: 'S2024010001',
    customer_name: '(주)ABC 회사',
    customer_business_number: '123-45-67890',
    customer_address: '서울시 강남구 테헤란로 123',
    customer_phone: '02-1234-5678',
    customer_email: 'contact@abc.com',
    items: [
      { 
        id: '1', 
        product_code: 'LAP001', 
        product_name: '노트북', 
        quantity: 2, 
        unit_price: 1000000, 
        total_price: 2000000 
      }
    ],
    subtotal: 2000000,
    tax_amount: 200000,
    total_amount: 2200000,
    status: 'pending',
    issue_date: '2024-01-15',
    due_date: '2024-02-15',
    nts_status: 'pending',
    created_by: 'admin',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
  },
  {
    id: '2',
    invoice_number: 'S2024010002',
    customer_name: '(주)XYZ 기업',
    customer_business_number: '987-65-43210',
    customer_address: '서울시 서초구 강남대로 456',
    customer_phone: '02-9876-5432',
    customer_email: 'info@xyz.com',
    items: [
      { 
        id: '2', 
        product_code: 'MOU001', 
        product_name: '마우스', 
        quantity: 10, 
        unit_price: 50000, 
        total_price: 500000 
      },
      { 
        id: '3', 
        product_code: 'KEY001', 
        product_name: '키보드', 
        quantity: 5, 
        unit_price: 100000, 
        total_price: 500000 
      }
    ],
    subtotal: 1500000,
    tax_amount: 150000,
    total_amount: 1650000,
    status: 'issued',
    issue_date: '2024-01-10',
    due_date: '2024-02-10',
    nts_status: 'issued',
    nts_issue_date: '2024-01-10',
    created_by: 'admin',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  }
]

export default function SalesManagement() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const statusLabels = {
    draft: '임시저장',
    pending: '승인대기',
    issued: '발행완료',
    paid: '결제완료',
    overdue: '연체'
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    issued: 'bg-green-100 text-green-800',
    paid: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800'
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateInvoice = async (data: any) => {
    setIsLoading(true)
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newInvoice: SalesInvoice = {
        id: Date.now().toString(),
        ...data,
        nts_status: 'pending',
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      setInvoices([...invoices, newInvoice])
      setIsFormOpen(false)
      toast.success('매출 계산서가 생성되었습니다.')
    } catch (error) {
      toast.error('매출 계산서 생성에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateInvoice = async (data: any) => {
    if (!selectedInvoice) return
    
    setIsLoading(true)
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedInvoice = {
        ...selectedInvoice,
        ...data,
        updated_at: new Date().toISOString(),
      }
      
      setInvoices(invoices.map(invoice => 
        invoice.id === selectedInvoice.id ? updatedInvoice : invoice
      ))
      setIsFormOpen(false)
      setSelectedInvoice(null)
      toast.success('매출 계산서가 수정되었습니다.')
    } catch (error) {
      toast.error('매출 계산서 수정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('정말로 이 계산서를 삭제하시겠습니까?')) return
    
    setIsLoading(true)
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId))
      setIsDetailOpen(false)
      setSelectedInvoice(null)
      toast.success('매출 계산서가 삭제되었습니다.')
    } catch (error) {
      toast.error('매출 계산서 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewInvoice = (invoice: SalesInvoice) => {
    setSelectedInvoice(invoice)
    setIsDetailOpen(true)
  }

  const handleEditInvoice = (invoice: SalesInvoice) => {
    setSelectedInvoice(invoice)
    setIsFormOpen(true)
  }

  const handleCloseModal = () => {
    setIsFormOpen(false)
    setIsDetailOpen(false)
    setSelectedInvoice(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">매출 관리</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          새 계산서 작성
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="고객명 또는 계산서 번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">전체 상태</option>
                <option value="draft">임시저장</option>
                <option value="pending">승인대기</option>
                <option value="issued">발행완료</option>
                <option value="paid">결제완료</option>
                <option value="overdue">연체</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>매출 계산서 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">계산서 번호</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">고객명</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">발행일</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">금액</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">상태</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">국세청 상태</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{invoice.invoice_number}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{invoice.customer_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatDate(invoice.issue_date)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(invoice.total_amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[invoice.status]}`}>
                          {statusLabels[invoice.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          invoice.nts_status === 'issued' ? 'bg-green-100 text-green-800' :
                          invoice.nts_status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.nts_status === 'issued' ? '발행완료' :
                           invoice.nts_status === 'failed' ? '발행실패' : '대기중'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        title={selectedInvoice ? '매출 계산서 수정' : '새 매출 계산서 작성'}
        size="xl"
      >
        <SalesInvoiceForm
          invoice={selectedInvoice || undefined}
          onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={handleCloseModal}
        title="매출 계산서 상세"
        size="xl"
      >
        {selectedInvoice && (
          <SalesInvoiceDetail
            invoice={selectedInvoice}
            onEdit={() => {
              setIsDetailOpen(false)
              setIsFormOpen(true)
            }}
            onDelete={() => handleDeleteInvoice(selectedInvoice.id)}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  )
}