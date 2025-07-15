'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import PurchaseInvoiceForm from '@/components/PurchaseInvoiceForm'
import PurchaseInvoiceDetail from '@/components/PurchaseInvoiceDetail'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PurchaseInvoice } from '@/types'
import toast from 'react-hot-toast'

// Mock data
const mockInvoices: PurchaseInvoice[] = [
  {
    id: '1',
    invoice_number: 'P2024010001',
    supplier_name: '(주)공급업체 A',
    supplier_business_number: '111-22-33444',
    supplier_address: '서울시 중구 을지로 100',
    supplier_phone: '02-1111-2222',
    supplier_email: 'supplier@a.com',
    items: [
      { product_name: '사무용품', quantity: 5, unit_price: 200000, total_price: 1000000 },
      { product_name: '컴퓨터', quantity: 2, unit_price: 800000, total_price: 1600000 }
    ],
    subtotal: 1800000,
    tax_amount: 180000,
    total_amount: 1980000,
    status: 'received',
    issue_date: '2024-01-12',
    due_date: '2024-02-12',
    received_date: '2024-01-12',
    nts_status: 'verified',
    nts_check_date: '2024-01-12',
    created_by: 'admin',
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-12T11:00:00Z',
  },
  {
    id: '2',
    invoice_number: 'P2024010002',
    supplier_name: '(주)공급업체 B',
    supplier_business_number: '555-66-77888',
    supplier_address: '서울시 영등포구 여의도동 200',
    supplier_phone: '02-5555-6666',
    supplier_email: 'supplier@b.com',
    items: [
      { product_name: '원자재', quantity: 10, unit_price: 120000, total_price: 1200000 }
    ],
    subtotal: 1200000,
    tax_amount: 120000,
    total_amount: 1320000,
    status: 'pending',
    issue_date: '2024-01-14',
    due_date: '2024-02-14',
    nts_status: 'pending',
    created_by: 'admin',
    created_at: '2024-01-14T12:00:00Z',
    updated_at: '2024-01-14T12:00:00Z',
  }
]

export default function PurchaseManagement() {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const statusLabels = {
    draft: '임시저장',
    pending: '수신대기',
    received: '수신완료',
    paid: '결제완료',
    overdue: '연체'
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    received: 'bg-green-100 text-green-800',
    paid: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800'
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateInvoice = async (data: any) => {
    setIsLoading(true)
    try {
      // 실제 환경에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newInvoice: PurchaseInvoice = {
        id: Date.now().toString(),
        ...data,
        nts_status: 'pending',
        created_by: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      setInvoices([...invoices, newInvoice])
      setIsFormOpen(false)
      toast.success('매입 계산서가 생성되었습니다.')
    } catch (error) {
      toast.error('매입 계산서 생성에 실패했습니다.')
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
      toast.success('매입 계산서가 수정되었습니다.')
    } catch (error) {
      toast.error('매입 계산서 수정에 실패했습니다.')
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
      toast.success('매입 계산서가 삭제되었습니다.')
    } catch (error) {
      toast.error('매입 계산서 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewInvoice = (invoice: PurchaseInvoice) => {
    setSelectedInvoice(invoice)
    setIsDetailOpen(true)
  }

  const handleEditInvoice = (invoice: PurchaseInvoice) => {
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
        <h1 className="text-2xl font-bold text-gray-900">매입 관리</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          새 계산서 등록
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
                  placeholder="공급업체명 또는 계산서 번호로 검색..."
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
                <option value="pending">수신대기</option>
                <option value="received">수신완료</option>
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
          <CardTitle>매입 계산서 목록</CardTitle>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">공급업체명</th>
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
                      <td className="py-3 px-4 text-sm text-gray-900">{invoice.supplier_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatDate(invoice.issue_date)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(invoice.total_amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[invoice.status]}`}>
                          {statusLabels[invoice.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          invoice.nts_status === 'verified' ? 'bg-green-100 text-green-800' :
                          invoice.nts_status === 'not_found' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.nts_status === 'verified' ? '확인완료' :
                           invoice.nts_status === 'not_found' ? '미확인' : '확인중'}
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
        title={selectedInvoice ? '매입 계산서 수정' : '새 매입 계산서 등록'}
        size="xl"
      >
        <PurchaseInvoiceForm
          invoice={selectedInvoice || undefined}
          onSubmit={selectedInvoice ? handleUpdateInvoice : handleCreateInvoice}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={handleCloseModal}
        title="매입 계산서 상세"
        size="xl"
      >
        {selectedInvoice && (
          <PurchaseInvoiceDetail
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