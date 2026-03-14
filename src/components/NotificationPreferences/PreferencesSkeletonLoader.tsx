/**
 * Loading skeleton for notification preferences
 */

export function PreferencesSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
      </div>

      {/* Preference rows skeleton */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="border-b border-slate-200 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Type label */}
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>

            {/* Toggle + frequency */}
            <div className="flex items-center gap-3">
              <div className="h-6 bg-slate-200 rounded-full w-10"></div>
              <div className="h-4 bg-slate-100 rounded w-20"></div>
            </div>

            {/* Channels */}
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 rounded w-8"></div>
              <div className="h-6 bg-slate-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Button skeleton */}
      <div className="flex gap-3 pt-6">
        <div className="h-10 bg-slate-200 rounded w-24"></div>
        <div className="h-10 bg-slate-100 rounded w-24"></div>
      </div>
    </div>
  )
}
