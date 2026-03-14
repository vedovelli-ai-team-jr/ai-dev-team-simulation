/**
 * Sticky save/cancel bar for unsaved preferences
 */

interface PreferencesSaveBarProps {
  isVisible: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  onSave: () => void
  onCancel: () => void
  onReset: () => void
}

export function PreferencesSaveBar({
  isVisible,
  isSaving,
  hasUnsavedChanges,
  onSave,
  onCancel,
  onReset,
}: PreferencesSaveBarProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-6 py-4 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-amber-600">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium" role="status">
                Unsaved changes
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            disabled={isSaving}
            aria-label="Reset to default preferences"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Cancel without saving"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
            aria-label="Save preferences"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
