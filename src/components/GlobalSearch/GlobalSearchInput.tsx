import { useRef, useEffect } from 'react'

interface GlobalSearchInputProps {
  value: string
  onChange: (value: string) => void
  onEscape?: () => void
  onFocus?: () => void
  onBlur?: () => void
  isLoading?: boolean
  placeholder?: string
}

export function GlobalSearchInput({
  value,
  onChange,
  onEscape,
  onFocus,
  onBlur,
  isLoading = false,
  placeholder = 'Search tasks, sprints, agents...',
}: GlobalSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K to focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // Escape to clear/close
      if (e.key === 'Escape') {
        onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape])

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <svg
          className="absolute left-3 w-5 h-5 text-slate-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          aria-label="Global search"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-3">
            <svg
              className="w-5 h-5 text-blue-400 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        )}

        {/* Clear Button */}
        {value && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none hidden sm:block">
          <kbd className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-400">
            ⌘K
          </kbd>
        </div>
      )}
    </div>
  )
}
