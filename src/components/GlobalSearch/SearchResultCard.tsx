import { useMemo } from 'react'
import type { GlobalSearchResult } from '../../types/search'

interface SearchResultCardProps {
  result: GlobalSearchResult
  query?: string
  onSelect?: (result: GlobalSearchResult) => void
}

/**
 * Utility to highlight matching text in a string
 */
function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export function SearchResultCard({
  result,
  query = '',
  onSelect,
}: SearchResultCardProps) {
  const statusColors: Record<string, string> = {
    'in-progress': 'bg-blue-900/30 text-blue-300 border-blue-700',
    done: 'bg-green-900/30 text-green-300 border-green-700',
    'in-review': 'bg-purple-900/30 text-purple-300 border-purple-700',
    backlog: 'bg-slate-700 text-slate-300',
    active: 'bg-blue-900/30 text-blue-300 border-blue-700',
    planning: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
    completed: 'bg-green-900/30 text-green-300 border-green-700',
    'working': 'bg-blue-900/30 text-blue-300',
    'idle': 'bg-slate-700 text-slate-300',
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-blue-900/30 text-blue-300 border-blue-700',
    medium: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
    high: 'bg-red-900/30 text-red-300 border-red-700',
  }

  const roleColors: Record<string, string> = {
    'sr-dev': 'bg-purple-900/30 text-purple-300',
    'junior': 'bg-blue-900/30 text-blue-300',
    'pm': 'bg-green-900/30 text-green-300',
  }

  const highlightedTitle = useMemo(
    () => highlightMatch(result.type === 'task' ? result.title : result.type === 'sprint' ? result.name : result.name, query),
    [result, query]
  )

  return (
    <button
      onClick={() => onSelect?.(result)}
      className="w-full text-left p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600 transition-colors group"
    >
      {result.type === 'task' && (
        <>
          {/* Task Result */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2 flex-1"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">Task</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                priorityColors[result.priority] || priorityColors.medium
              }`}
            >
              {result.priority}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                statusColors[result.status] || statusColors.backlog
              }`}
            >
              {result.status.replace('-', ' ')}
            </span>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
              <span className="truncate">{result.assignee}</span>
            </div>
            <span className="truncate ml-auto flex-shrink-0">{result.sprint}</span>
          </div>
        </>
      )}

      {result.type === 'sprint' && (
        <>
          {/* Sprint Result */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2 flex-1"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">Sprint</span>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                statusColors[result.status] || statusColors.backlog
              }`}
            >
              {result.status.replace('-', ' ')}
            </span>
          </div>

          {/* Task Metrics */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{result.completedCount} of {result.taskCount} tasks done</span>
            <span className="text-slate-500">
              {Math.round((result.completedCount / result.taskCount) * 100) || 0}%
            </span>
          </div>
        </>
      )}

      {result.type === 'agent' && (
        <>
          {/* Agent Result */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2 flex-1"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">Agent</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Role Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                roleColors[result.role] || 'bg-slate-700 text-slate-300'
              }`}
            >
              {result.role}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                statusColors[result.status] || statusColors.idle
              }`}
            >
              {result.status}
            </span>
          </div>

          {/* Current Task */}
          {result.currentTask && (
            <div className="text-xs text-slate-400">
              Currently working on: <span className="text-slate-300">{result.currentTask}</span>
            </div>
          )}
        </>
      )}
    </button>
  )
}
