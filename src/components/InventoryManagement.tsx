'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { InventoryItem } from '@/types'

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    product_code: 'P001',
    product_name: '노트북 A모델',
    category: '전자제품',
    unit: '대',
    current_stock: 15,
    minimum_stock: 10,
    unit_price: 1200000,
    location: '창고A-1',
    supplier: '(주)공급업체 A',
    status: 'active',
    stock_status: 'in_stock',
    last_updated: '2024-01-15T10:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    product_code: 'P002',
    product_name: '마우스 B모델',
    category: '전자제품',
    unit: '개',
    current_stock: 5,
    minimum_stock: 20,
    unit_price: 25000,
    location: '창고A-2',
    supplier: '(주)공급업체 B',
    status: 'active',
    stock_status: 'low_stock',
    last_updated: '2024-01-14T15:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-14T15:00:00Z',
  },
  {
    id: '3',
    product_code: 'P003',
    product_name: '키보드 C모델',
    category: '전자제품',
    unit: '개',
    current_stock: 30,
    minimum_stock: 15,
    unit_price: 80000,
    location: '창고B-1',
    supplier: '(주)공급업체 C',
    status: 'active',
    stock_status: 'in_stock',
    last_updated: '2024-01-13T09:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-13T09:00:00Z',
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  discontinued: 'bg-red-100 text-red-800',
}

const statusLabels = {
  active: '활성',
  inactive: '비활성',
  discontinued: '단종',
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.product_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock === 0) return { label: '품절', color: 'bg-red-100 text-red-800' }
    if (item.current_stock <= item.minimum_stock) return { label: '부족', color: 'bg-orange-100 text-orange-800' }
    return { label: '정상', color: 'bg-green-100 text-green-800' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">재고 관리</h1>
        <Button onClick={() => console.log('새 상품 등록')}>
          <Plus className="w-4 h-4 mr-2" />
          새 상품 등록
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
                  placeholder="상품명 또는 상품코드로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">전체 카테고리</option>
                <option value="전자제품">전자제품</option>
                <option value="의류">의류</option>
                <option value="식품">식품</option>
                <option value="기타">기타</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">전체 상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="discontinued">단종</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>재고 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">상품코드</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">상품명</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">카테고리</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">현재고</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">최소재고</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">단가</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">재고상태</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item)
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.product_code}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          {item.current_stock <= item.minimum_stock && (
                            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                          )}
                          {item.product_name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.category}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.current_stock} {item.unit}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.minimum_stock} {item.unit}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatCurrency(item.unit_price)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}