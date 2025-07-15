'use client'

import { useState } from 'react'
import { FileText, Download, Shield, Edit, Trash2, Check, X } from 'lucide-react'
import Button from './ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PurchaseInvoice } from '@/types'

interface PurchaseInvoiceDetailProps {
  invoice: PurchaseInvoice
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export default function PurchaseInvoiceDetail({ invoice, onEdit, onDelete, onClose }: PurchaseInvoiceDetailProps) {
  const [verifyingNts, setVerifyingNts] = useState(false)

  const handleNtsVerification = async () => {
    setVerifyingNts(true)
    // 실제 환경에서는 국세청 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000))
    setVerifyingNts(false)
    // 상태 업데이트 로직
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'received': return 'bg-green-100 text-green-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return '임시저장'
      case 'pending': return '수신대기'
      case 'received': return '수신완료'
      case 'paid': return '결제완료'
      case 'overdue': return '연체'
      default: return '알 수 없음'
    }
  }

  const getNtsStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'not_found': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getNtsStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return '확인완료'
      case 'not_found': return '미확인'
      default: return '확인중'
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{invoice.invoice_number}</h2>
            <p className="text-sm text-gray-600">매입 세금계산서</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            수정
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      {/* 상태 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <span className="text-sm text-gray-600">계산서 상태</span>
          <div className="mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
              {getStatusLabel(invoice.status)}
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-600">국세청 확인 상태</span>
          <div className="mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getNtsStatusColor(invoice.nts_status)}`}>
              {getNtsStatusLabel(invoice.nts_status)}
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-600">총 금액</span>
          <div className="mt-1">
            <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">발행 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">발행일</span>
              <span className="text-sm font-medium">{formatDate(invoice.issue_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">결제 기한</span>
              <span className="text-sm font-medium">{formatDate(invoice.due_date)}</span>
            </div>
            {invoice.received_date && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">수신일</span>
                <span className="text-sm font-medium">{formatDate(invoice.received_date)}</span>
              </div>
            )}
            {invoice.nts_check_date && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">국세청 확인일</span>
                <span className="text-sm font-medium">{formatDate(invoice.nts_check_date)}</span>
              </div>
            )}
            {invoice.payment_date && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">결제일</span>
                <span className="text-sm font-medium">{formatDate(invoice.payment_date)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">공급업체 정보</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">공급업체명</span>
              <span className="text-sm font-medium">{invoice.supplier_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">사업자등록번호</span>
              <span className="text-sm font-medium">{invoice.supplier_business_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">전화번호</span>
              <span className="text-sm font-medium">{invoice.supplier_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">이메일</span>
              <span className="text-sm font-medium">{invoice.supplier_email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 품목 정보 */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">품목 정보</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">품목명</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">수량</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">단가</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.product_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 금액 정보 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="max-w-sm ml-auto space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">소계</span>
            <span className="text-sm font-medium">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">세액 (10%)</span>
            <span className="text-sm font-medium">{formatCurrency(invoice.tax_amount)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
            <span>총 금액</span>
            <span>{formatCurrency(invoice.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* 비고 */}
      {invoice.notes && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">비고</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-between items-center border-t pt-4">
        <div className="flex gap-2">
          {invoice.nts_status === 'pending' && (
            <Button onClick={handleNtsVerification} disabled={verifyingNts}>
              {verifyingNts ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  국세청 확인 중...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  국세청 확인
                </>
              )}
            </Button>
          )}
          {invoice.status === 'received' && (
            <Button variant="outline">
              <Check className="w-4 h-4 mr-2" />
              결제 완료 처리
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          닫기
        </Button>
      </div>
    </div>
  )
}