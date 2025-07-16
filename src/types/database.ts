export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'staff' | 'accounting'
          business_number?: string
          phone?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'staff' | 'accounting'
          business_number?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'staff' | 'accounting'
          business_number?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          business_number: string
          representative: string
          business_type: string
          business_item: string
          address: string
          email?: string
          phone?: string
          fax?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          business_number: string
          representative: string
          business_type: string
          business_item: string
          address: string
          email?: string
          phone?: string
          fax?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          business_number?: string
          representative?: string
          business_type?: string
          business_item?: string
          address?: string
          email?: string
          phone?: string
          fax?: string
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          business_number: string
          representative: string
          business_type: string
          business_item: string
          address: string
          email?: string
          phone?: string
          fax?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          business_number: string
          representative: string
          business_type: string
          business_item: string
          address: string
          email?: string
          phone?: string
          fax?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          business_number?: string
          representative?: string
          business_type?: string
          business_item?: string
          address?: string
          email?: string
          phone?: string
          fax?: string
          created_at?: string
          updated_at?: string
        }
      }
      sales_invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_id: string
          issue_date: string
          due_date: string
          subtotal: number
          tax_amount: number
          total_amount: number
          status: 'draft' | 'pending' | 'approved' | 'issued' | 'paid'
          notes?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          customer_id: string
          issue_date: string
          due_date: string
          subtotal: number
          tax_amount: number
          total_amount: number
          status?: 'draft' | 'pending' | 'approved' | 'issued' | 'paid'
          notes?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          customer_id?: string
          issue_date?: string
          due_date?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          status?: 'draft' | 'pending' | 'approved' | 'issued' | 'paid'
          notes?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      sales_invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      purchase_invoices: {
        Row: {
          id: string
          invoice_number: string
          supplier_id: string
          issue_date: string
          due_date: string
          subtotal: number
          tax_amount: number
          total_amount: number
          status: 'draft' | 'pending' | 'approved' | 'received' | 'paid'
          notes?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          supplier_id: string
          issue_date: string
          due_date: string
          subtotal: number
          tax_amount: number
          total_amount: number
          status?: 'draft' | 'pending' | 'approved' | 'received' | 'paid'
          notes?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          supplier_id?: string
          issue_date?: string
          due_date?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          status?: 'draft' | 'pending' | 'approved' | 'received' | 'paid'
          notes?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      purchase_invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          code: string
          category: string
          unit: string
          unit_price: number
          current_stock: number
          minimum_stock: number
          maximum_stock: number
          status: 'active' | 'inactive' | 'discontinued'
          description?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          category: string
          unit: string
          unit_price: number
          current_stock: number
          minimum_stock: number
          maximum_stock: number
          status?: 'active' | 'inactive' | 'discontinued'
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          category?: string
          unit?: string
          unit_price?: number
          current_stock?: number
          minimum_stock?: number
          maximum_stock?: number
          status?: 'active' | 'inactive' | 'discontinued'
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          item_id: string
          type: 'in' | 'out' | 'adjustment'
          quantity: number
          unit_price: number
          total_amount: number
          reference_type: 'sales' | 'purchase' | 'adjustment'
          reference_id?: string
          notes?: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          type: 'in' | 'out' | 'adjustment'
          quantity: number
          unit_price: number
          total_amount: number
          reference_type: 'sales' | 'purchase' | 'adjustment'
          reference_id?: string
          notes?: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          type?: 'in' | 'out' | 'adjustment'
          quantity?: number
          unit_price?: number
          total_amount?: number
          reference_type?: 'sales' | 'purchase' | 'adjustment'
          reference_id?: string
          notes?: string
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}