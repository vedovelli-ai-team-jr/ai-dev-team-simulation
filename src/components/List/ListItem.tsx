import type { Item } from '../../types/item'

interface ListItemProps {
  item: Item
  onDelete: (id: string) => void
  isDeleting: boolean
}

/**
 * ListItem component for displaying a single item in the list.
 * Provides delete functionality with loading state.
 */
export function ListItem({ item, onDelete, isDeleting }: ListItemProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{item.title}</h3>
          {item.description && (
            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{item.description}</p>
          )}
          <p className="text-slate-500 text-xs mt-2">Updated: {new Date(item.updatedAt).toLocaleString()}</p>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 disabled:bg-red-600/20 disabled:opacity-50 text-red-400 text-sm rounded transition-colors whitespace-nowrap"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
