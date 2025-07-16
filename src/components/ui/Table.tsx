'use client'

import React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TableProps, TableColumn, Sort } from '@/types'
import Loading from './Loading'
import Pagination from './Pagination'

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  onPageChange,
  onSortChange,
  onRowClick,
  selectable = false,
  selectedItems = [],
  onSelectionChange
}: TableProps<T>) {
  const [currentSort, setCurrentSort] = React.useState<Sort | null>(null)

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return

    const newOrder = 
      currentSort?.field === column.key 
        ? currentSort.order === 'asc' ? 'desc' : 'asc'
        : 'asc'

    const newSort: Sort = {
      field: String(column.key),
      order: newOrder
    }

    setCurrentSort(newSort)
    onSortChange?.(newSort)
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    onSelectionChange(checked ? data : [])
  }

  const handleSelectItem = (item: T, checked: boolean) => {
    if (!onSelectionChange) return
    
    if (checked) {
      onSelectionChange([...selectedItems, item])
    } else {
      onSelectionChange(selectedItems.filter(selected => selected.id !== item.id))
    }
  }

  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null

    const isActive = currentSort?.field === column.key
    
    if (!isActive) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }

    return currentSort?.order === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-gray-700" />
      : <ChevronDown className="h-4 w-4 text-gray-700" />
  }

  const isAllSelected = data.length > 0 && selectedItems.length === data.length
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loading />
      </div>
    )
  }

  return (
    <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="relative w-12 px-6 sm:w-16 sm:px-8">
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-6 py-4 text-center text-gray-500"
                >
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isSelected = selectedItems.some(selected => selected.id === item.id)
                
                return (
                  <tr
                    key={item.id || index}
                    className={cn(
                      'hover:bg-gray-50',
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-gray-50'
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleSelectItem(item, e.target.checked)
                          }}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render 
                          ? column.render(item[column.key], item)
                          : item[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && onPageChange && (
        <div className="border-t border-gray-200 px-6 py-3">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default Table