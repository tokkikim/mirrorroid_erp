'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import Button from './ui/Button'
import { formatCurrency } from '@/lib/utils'
import { SalesInvoice, InvoiceItem } from '@/types'

interface SalesInvoiceFormProps {
  invoice?: SalesInvoice
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function SalesInvoiceForm({ invoice, onSubmit, onCancel }: SalesInvoiceFormProps) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: invoice || {
      invoice_number: '',
      customer_name: '',
      customer_business_number: '',
      customer_address: '',
      customer_phone: '',
      customer_email: '',
      items: [{ 
        id: 'temp-1', 
        product_code: '', 
        product_name: '', 
        quantity: 1, 
        unit_price: 0, 
        total_price: 0 
      }],
      issue_date: new Date().toISOString().split('T')[0],
      due_date: '',
      notes: ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItems = watch('items')

  // 항목별 금액 계산
  const calculateItemTotal = (index: number) => {
    const item = watchItems[index]
    if (item && item.quantity && item.unit_price) {
      const total = item.quantity * item.unit_price
      setValue(`items.${index}.total_price`, total)
      return total
    }
    return 0
  }

  // 전체 금액 계산
  const calculateTotals = () => {
    const subtotal = watchItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price || 0)
    }, 0)
    const tax_amount = subtotal * 0.1 // 10% 세금
    const total_amount = subtotal + tax_amount

    return { subtotal, tax_amount, total_amount }
  }

  const { subtotal, tax_amount, total_amount } = calculateTotals()

  const handleFormSubmit = (data: any) => {
    const formData = {
      ...data,
      subtotal,
      tax_amount,
      total_amount,
      status: 'draft'
    }
    onSubmit(formData)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">계산서 번호</label>
            <input
              type="text"
              {...register('invoice_number', { required: '계산서 번호는 필수입니다' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="S2024010001"
            />
            {errors.invoice_number && (
              <p className="text-red-500 text-sm mt-1">{errors.invoice_number.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">발행일</label>
            <input
              type="date"
              {...register('issue_date', { required: '발행일은 필수입니다' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 고객 정보 */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">고객 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">고객명</label>
              <input
                type="text"
                {...register('customer_name', { required: '고객명은 필수입니다' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(주)ABC 회사"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
              <input
                type="text"
                {...register('customer_business_number', { required: '사업자등록번호는 필수입니다' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123-45-67890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input
                type="text"
                {...register('customer_address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="서울시 강남구 테헤란로 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="tel"
                {...register('customer_phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="02-1234-5678"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                {...register('customer_email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@abc.com"
              />
            </div>
          </div>
        </div>

        {/* 품목 정보 */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">품목 정보</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ 
                id: `temp-${Date.now()}`, 
                product_code: '', 
                product_name: '', 
                quantity: 1, 
                unit_price: 0, 
                total_price: 0 
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              품목 추가
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">품목명</label>
                  <input
                    type="text"
                    {...register(`items.${index}.product_name`, { required: '품목명은 필수입니다' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="품목명"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-sm font-medium text-gray-700 mb-1">수량</label>
                  <input
                    type="number"
                    {...register(`items.${index}.quantity`, { 
                      required: '수량은 필수입니다',
                      min: { value: 1, message: '수량은 1 이상이어야 합니다' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={() => calculateItemTotal(index)}
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">단가</label>
                  <input
                    type="number"
                    {...register(`items.${index}.unit_price`, { 
                      required: '단가는 필수입니다',
                      min: { value: 0, message: '단가는 0 이상이어야 합니다' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={() => calculateItemTotal(index)}
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">금액</label>
                  <input
                    type="text"
                    value={formatCurrency(watchItems[index]?.quantity * watchItems[index]?.unit_price || 0)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 금액 정보 */}
        <div className="border-t pt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">소계</span>
              <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">세액 (10%)</span>
              <span className="text-sm font-medium">{formatCurrency(tax_amount)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>총 금액</span>
              <span>{formatCurrency(total_amount)}</span>
            </div>
          </div>
        </div>

        {/* 기타 정보 */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">결제 기한</label>
              <input
                type="date"
                {...register('due_date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비고사항을 입력하세요"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">
            {invoice ? '수정' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  )
}