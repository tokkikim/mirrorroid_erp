import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SalesInvoice, PurchaseInvoice, InventoryItem } from '@/types'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'accounting'
}

interface AppState {
  // Auth State
  user: User | null
  isAuthenticated: boolean
  
  // Sales State
  salesInvoices: SalesInvoice[]
  salesLoading: boolean
  salesError: string | null
  
  // Purchase State
  purchaseInvoices: PurchaseInvoice[]
  purchaseLoading: boolean
  purchaseError: string | null
  
  // Inventory State
  inventoryItems: InventoryItem[]
  inventoryLoading: boolean
  inventoryError: string | null
  
  // UI State
  sidebarOpen: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  
  // Sales Actions
  setSalesInvoices: (invoices: SalesInvoice[]) => void
  addSalesInvoice: (invoice: SalesInvoice) => void
  updateSalesInvoice: (id: string, updates: Partial<SalesInvoice>) => void
  deleteSalesInvoice: (id: string) => void
  setSalesLoading: (loading: boolean) => void
  setSalesError: (error: string | null) => void
  
  // Purchase Actions
  setPurchaseInvoices: (invoices: PurchaseInvoice[]) => void
  addPurchaseInvoice: (invoice: PurchaseInvoice) => void
  updatePurchaseInvoice: (id: string, updates: Partial<PurchaseInvoice>) => void
  deletePurchaseInvoice: (id: string) => void
  setPurchaseLoading: (loading: boolean) => void
  setPurchaseError: (error: string | null) => void
  
  // Inventory Actions
  setInventoryItems: (items: InventoryItem[]) => void
  addInventoryItem: (item: InventoryItem) => void
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  setInventoryLoading: (loading: boolean) => void
  setInventoryError: (error: string | null) => void
  
  // UI Actions
  setSidebarOpen: (open: boolean) => void
}

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      
      salesInvoices: [],
      salesLoading: false,
      salesError: null,
      
      purchaseInvoices: [],
      purchaseLoading: false,
      purchaseError: null,
      
      inventoryItems: [],
      inventoryLoading: false,
      inventoryError: null,
      
      sidebarOpen: true,
      
      // Auth Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      // Sales Actions
      setSalesInvoices: (invoices) => set({ salesInvoices: invoices }),
      addSalesInvoice: (invoice) => 
        set((state) => ({ 
          salesInvoices: [...state.salesInvoices, invoice] 
        })),
      updateSalesInvoice: (id, updates) =>
        set((state) => ({
          salesInvoices: state.salesInvoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updates } : invoice
          )
        })),
      deleteSalesInvoice: (id) =>
        set((state) => ({
          salesInvoices: state.salesInvoices.filter((invoice) => invoice.id !== id)
        })),
      setSalesLoading: (loading) => set({ salesLoading: loading }),
      setSalesError: (error) => set({ salesError: error }),
      
      // Purchase Actions
      setPurchaseInvoices: (invoices) => set({ purchaseInvoices: invoices }),
      addPurchaseInvoice: (invoice) =>
        set((state) => ({
          purchaseInvoices: [...state.purchaseInvoices, invoice]
        })),
      updatePurchaseInvoice: (id, updates) =>
        set((state) => ({
          purchaseInvoices: state.purchaseInvoices.map((invoice) =>
            invoice.id === id ? { ...invoice, ...updates } : invoice
          )
        })),
      deletePurchaseInvoice: (id) =>
        set((state) => ({
          purchaseInvoices: state.purchaseInvoices.filter((invoice) => invoice.id !== id)
        })),
      setPurchaseLoading: (loading) => set({ purchaseLoading: loading }),
      setPurchaseError: (error) => set({ purchaseError: error }),
      
      // Inventory Actions
      setInventoryItems: (items) => set({ inventoryItems: items }),
      addInventoryItem: (item) =>
        set((state) => ({
          inventoryItems: [...state.inventoryItems, item]
        })),
      updateInventoryItem: (id, updates) =>
        set((state) => ({
          inventoryItems: state.inventoryItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
        })),
      deleteInventoryItem: (id) =>
        set((state) => ({
          inventoryItems: state.inventoryItems.filter((item) => item.id !== id)
        })),
      setInventoryLoading: (loading) => set({ inventoryLoading: loading }),
      setInventoryError: (error) => set({ inventoryError: error }),
      
      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'mirrorroid-erp-store',
    }
  )
)