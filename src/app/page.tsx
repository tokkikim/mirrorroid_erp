'use client'

import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'
import SalesManagement from '@/components/SalesManagement'
import PurchaseManagement from '@/components/PurchaseManagement'
import InventoryManagement from '@/components/InventoryManagement'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'sales':
        return <SalesManagement />
      case 'purchase':
        return <PurchaseManagement />
      case 'inventory':
        return <InventoryManagement />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      <Toaster position="top-right" />
    </Layout>
  )
}