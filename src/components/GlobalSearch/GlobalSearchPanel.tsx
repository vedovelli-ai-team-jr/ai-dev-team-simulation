import { useRef, useEffect } from 'react'
import { useGlobalSearch } from '../../hooks/useGlobalSearch'
import { GlobalSearchInput } from './GlobalSearchInput'
import { GlobalSearchResults } from './GlobalSearchResults'
import type { GlobalSearchResult } from '../../types/search'

interface GlobalSearchPanelProps {
  /** Whether the panel is open */
  isOpen: boolean
  /** Callback when panel should close */
  onClose?: () => void
  /** Callback when a result is selected */
  onResultSelect?: (result: GlobalSearchResult) => void
  /** Custom CSS classes for the panel */
  className?: string
}

/**
 * Global search panel component
 *
 * Features:
 * - Controlled input with debounced search
 * - Grouped results by type (tasks, sprints, agents)
 * - Type filter tabs (All / Tasks / Sprints / Agents)
 * - Keyboard navigation (Arrow keys, Enter, Esc)
 * - Keyboard shortcuts (Cmd+K / Ctrl+K to focus)
 * - Empty and no-results states
 * - Loading state with skeleton cards
 * - Pagination support
 * - Click outside to close
 * - Keyboard shortcut trigger
 */
export function GlobalSearchPanel({
  isOpen,
  onClose,
  onResultSelect,
  className = '',
}: GlobalSearchPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const searchHook = useGlobalSearch()

  const {
    results,
    grouped,
    isLoading,
    isFetching,
    error,
    page,
    pageSize,
    total,
    query,
    typeFilter,
    setQuery,
    setTypeFilter,
    setPage,
  } = searchHook

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isEmpty = !query.trim()
  const hasResults = results.length > 0
  const hasError = !!error

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-20 ${className}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl mx-4 rounded-lg border border-slate-700 bg-slate-900 shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/50">
          <GlobalSearchInput
            value={query}
            onChange={setQuery}
            onEscape={onClose}
            isLoading={isLoading}
            placeholder="Search tasks, sprints, agents... (press Esc to close)"
          />
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4">
          {hasError && (
            <div className="rounded-lg border border-red-700 bg-red-900/20 p-4">
              <div className="flex items-start gap-3">
                <div className="text-red-400 mt-0.5">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-red-300 mb-1">Search Error</h3>
                  <p className="text-sm text-red-200">
                    {error?.message || 'Failed to fetch search results'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!hasError && (
            <GlobalSearchResults
              results={results}
              grouped={grouped}
              isLoading={isLoading}
              isFetching={isFetching}
              isEmpty={isEmpty}
              query={query}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              onResultSelect={(result) => {
                onResultSelect?.(result)
                onClose?.()
              }}
              total={total}
              page={page}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Footer Info */}
        {hasResults && !isEmpty && (
          <div className="border-t border-slate-700 bg-slate-800/30 px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
            <div>
              {results.length === 0 ? 'No' : results.length} result{results.length !== 1 ? 's' : ''} shown
            </div>
            <div className="flex gap-4">
              <div>
                Use <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-400">↑↓</kbd> to navigate
              </div>
              <div>
                Press <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-400">Enter</kbd> to select
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
