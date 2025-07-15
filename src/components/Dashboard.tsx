'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, FileText } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { DashboardStats } from '@/types'

// Mock data - 실제 환경에서는 API에서 가져올 데이터
const mockStats: DashboardStats = {
  total_sales: 125000000,
  total_purchases: 85000000,
  pending_invoices: 12,
  low_stock_items: 5,
  monthly_sales: 25000000,
  monthly_purchases: 18000000,
  overdue_invoices: 3,
}

const monthlyData = [
  { name: '1월', sales: 20000000, purchases: 15000000 },
  { name: '2월', sales: 22000000, purchases: 16000000 },
  { name: '3월', sales: 25000000, purchases: 18000000 },
  { name: '4월', sales: 28000000, purchases: 20000000 },
  { name: '5월', sales: 30000000, purchases: 22000000 },
  { name: '6월', sales: 25000000, purchases: 18000000 },
]

const categoryData = [
  { name: '전자제품', value: 40, color: '#3B82F6' },
  { name: '의류', value: 25, color: '#10B981' },
  { name: '식품', value: 20, color: '#F59E0B' },
  { name: '기타', value: 15, color: '#EF4444' },
]

const urgentItems = [
  { type: 'invoice', title: '미수금 알림', message: '(주)ABC 회사 - 2,500,000원 (5일 경과)', priority: 'high' },
  { type: 'stock', title: '재고 부족', message: '노트북 A모델 - 현재고: 2개 (최소재고: 10개)', priority: 'medium' },
  { type: 'tax', title: '세금계산서 미발행', message: '3건의 세금계산서 발행 대기 중', priority: 'high' },
  { type: 'purchase', title: '구매 알림', message: '매입세금계산서 미수신 (마감일 3일 전)', priority: 'medium' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 환경에서는 API 호출
    const fetchStats = async () => {
      try {
        // const response = await fetch('/api/dashboard/stats')
        // const data = await response.json()
        // setStats(data)
        setStats(mockStats)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 매출</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_sales)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% 전월 대비
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 매입</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_purchases)}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% 전월 대비
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">미처리 계산서</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_invoices}건</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  처리 필요
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">재고 부족</p>
                <p className="text-2xl font-bold text-gray-900">{stats.low_stock_items}개</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  주문 필요
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>월별 매출/매입 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="sales" fill="#3B82F6" name="매출" />
                <Bar dataKey="purchases" fill="#10B981" name="매입" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 매출 비율</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Items */}
      <Card>
        <CardHeader>
          <CardTitle>긴급 처리 항목</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentItems.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  item.priority === 'high'
                    ? 'border-red-500 bg-red-50'
                    : 'border-orange-500 bg-orange-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {item.priority === 'high' ? '긴급' : '중요'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}