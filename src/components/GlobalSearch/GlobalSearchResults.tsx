import { useState } from 'react'
import { SearchResultCard } from './SearchResultCard'
import type { GlobalSearchResult, GlobalSearchGroupedResults } from '../../types/search'

interface GlobalSearchResultsProps {
  results: GlobalSearchResult[]
  grouped: GlobalSearchGroupedResults
  isLoading: boolean
  isFetching: boolean
  isEmpty: boolean
  query: string
  typeFilter: 'all' | 'task' | 'sprint' | 'agent'
  onTypeFilterChange: (type: 'all' | 'task' | 'sprint' | 'agent') => void
  onResultSelect?: (result: GlobalSearchResult) => void
  total: number
  page: number
  onPageChange?: (page: number) => void
}

export function GlobalSearchResults({
  results,
  grouped,
  isLoading,
  isFetching,
  isEmpty,
  query,
  typeFilter,
  onTypeFilterChange,
  onResultSelect,
  total,
  page,
  onPageChange,
}: GlobalSearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev === -1 ? results.length - 1 : prev - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onResultSelect?.(results[selectedIndex])
        }
        break
    }
  }

  // Type filter tabs
  const filterTabs: { label: string; value: 'all' | 'task' | 'sprint' | 'agent'; count?: number }[] = [
    { label: 'All', value: 'all' },
    { label: 'Tasks', value: 'task', count: grouped.tasks.length },
    { label: 'Sprints', value: 'sprint', count: grouped.sprints.length },
    { label: 'Agents', value: 'agent', count: grouped.agents.length },
  ]

  // Empty state
  if (!query.trim()) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center">
        <svg
          className="w-16 h-16 text-slate-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-white mb-2">Start searching</h2>
        <p className="text-slate-400 mb-4">
          Search for tasks, sprints, or agents to get started
        </p>
        <p className="text-sm text-slate-500">
          Use <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-400">Cmd+K</kbd> to focus the search
        </p>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 animate-pulse"
          >
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-3" />
            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-slate-700 rounded w-16" />
              <div className="h-6 bg-slate-700 rounded w-20" />
            </div>
            <div className="h-3 bg-slate-700 rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  // No results state
  if (isEmpty && !isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center">
        <svg
          className="w-16 h-16 text-slate-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-white mb-2">No results found</h2>
        <p className="text-slate-400">
          Try adjusting your search terms or filters
        </p>
      </div>
    )
  }

  // Results view
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4" onKeyDown={handleKeyDown}>
      {/* Type Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-700 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              onTypeFilterChange(tab.value)
              setSelectedIndex(-1)
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              typeFilter === tab.value
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300 border-b-2 border-transparent'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 text-xs text-slate-500">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-2">
        {results.length > 0 && (
          <>
            <div className="text-sm text-slate-400 px-1">
              Found {total} result{total !== 1 ? 's' : ''}
              {isFetching && <span className="text-slate-500 ml-2">(updating...)</span>}
            </div>

            {/* Result Cards */}
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`rounded-lg transition-colors ${
                    selectedIndex === idx ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <SearchResultCard
                    result={result}
                    query={query}
                    onSelect={onResultSelect}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 10 && onPageChange && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-400">
                  Page {page}
                </span>

                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={results.length < 10}
                  className="px-3 py-1 text-sm bg-slate-800 border border-slate-700 rounded text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
