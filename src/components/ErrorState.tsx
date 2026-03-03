interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | null
  onRetry?: () => void
}

export function ErrorState({
  title = 'Error',
  message = 'Something went wrong',
  error,
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 text-4xl text-red-500">⚠️</div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-center mb-4">{message}</p>
      {error && (
        <details className="max-w-md">
          <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-400">
            Error details
          </summary>
          <pre className="mt-2 p-2 bg-slate-900 rounded text-xs text-red-400 overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
