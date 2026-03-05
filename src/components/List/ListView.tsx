import { useState } from 'react'
import type { Item } from '../../types/item'
import { useListItemsQuery, useAddListItem, useRemoveListItem } from '../../hooks/queries/useListItemsQuery'
import { ListItem } from './ListItem'

interface ListViewProps {
  pageSize?: number
}

/**
 * ListView component for displaying paginated list items.
 * Manages fetching, adding, and removing items with proper loading/error states.
 *
 * Features:
 * - Pagination support
 * - Add item functionality
 * - Delete item with optimistic updates
 * - Loading and error states
 */
export function ListView({ pageSize = 10 }: ListViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [newItemTitle, setNewItemTitle] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')

  const { items, isLoading, error, pagination, refetch } = useListItemsQuery({
    page: currentPage,
    pageSize,
  })

  const { mutate: addItem, isPending: isAddingItem } = useAddListItem()
  const { mutate: removeItem, isPending: isRemovingItem } = useRemoveListItem()

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      return
    }

    addItem(
      {
        title: newItemTitle,
        description: newItemDescription,
      },
      {
        onSuccess: () => {
          setNewItemTitle('')
          setNewItemDescription('')
          // Refetch to ensure we're on the correct page
          refetch()
        },
      }
    )
  }

  const handleRemoveItem = (id: string) => {
    removeItem(
      { id },
      {
        onSuccess: () => {
          // If we deleted the last item on this page and it wasn't page 1,
          // go back to the previous page
          if (items.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1)
          }
        },
      }
    )
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Item Form */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Item</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Item title"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            disabled={isAddingItem}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 disabled:opacity-50"
          />
          <textarea
            placeholder="Item description"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            disabled={isAddingItem}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleAddItem}
            disabled={isAddingItem || !newItemTitle.trim()}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-50 text-white font-medium rounded transition-colors"
          >
            {isAddingItem ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">Loading items...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Error loading items: {(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && !error && (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-400">No items yet. Add one to get started!</p>
        </div>
      )}

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              onDelete={handleRemoveItem}
              isDeleting={isRemovingItem}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4 border border-slate-700">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            Previous
          </button>

          <div className="text-slate-300">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} items)
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= pagination.totalPages}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 text-white rounded transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
