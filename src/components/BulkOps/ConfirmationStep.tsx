import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ConfirmationStepProps {
  operationType: 'update-settings' | 'assign-tasks'
  agentCount: number
  operationDetails: Record<string, unknown>
  status: 'idle' | 'running' | 'success' | 'error'
  error?: string | null
  successCount?: number
  failedAgents?: string[]
  totalRequested?: number
  onConfirm: () => void
  onRetry: () => void
  onSkipFailed: () => void
  isLoading?: boolean
}

export function ConfirmationStep({
  operationType,
  agentCount,
  operationDetails,
  status,
  error,
  successCount = 0,
  failedAgents = [],
  totalRequested = 0,
  onConfirm,
  onRetry,
  onSkipFailed,
  isLoading,
}: ConfirmationStepProps) {
  const operationLabel = operationType === 'update-settings' ? 'Update Agent Settings' : 'Assign Task'

  if (status === 'running') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Processing...</h3>
          <p className="text-gray-600 mt-2">Your bulk operation is in progress. Please wait.</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-900">Operation Failed</h4>
            <p className="text-red-800 mt-1">{error}</p>
            {failedAgents.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-900">Failed agents ({failedAgents.length}):</p>
                <ul className="text-sm text-red-800 mt-1 ml-4 list-disc">
                  {failedAgents.slice(0, 5).map((agentId) => (
                    <li key={agentId}>{agentId}</li>
                  ))}
                  {failedAgents.length > 5 && <li>... and {failedAgents.length - 5} more</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            Retry All
          </button>
          <button
            onClick={onSkipFailed}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 font-medium"
          >
            Skip Failed Items
          </button>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Operation Completed</h4>
            <p className="text-green-800 mt-1">
              {successCount} of {totalRequested} agents processed successfully.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Review Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span className="text-gray-700">Operation Type:</span>
            <span className="font-medium text-gray-900">{operationLabel}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-blue-100">
            <span className="text-gray-700">Agents to Update:</span>
            <span className="font-medium text-gray-900">{agentCount}</span>
          </div>

          {operationType === 'update-settings' ? (
            <>
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-700">New Status:</span>
                <span className="font-medium text-gray-900">
                  {String(operationDetails.status)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Capacity:</span>
                <span className="font-medium text-gray-900">
                  {String(operationDetails.capacity)} tasks
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-700">Task:</span>
                <span className="font-medium text-gray-900">
                  {String(operationDetails.taskName)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-700">Priority:</span>
                <span className="font-medium text-gray-900">
                  {String(operationDetails.priority)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
      >
        {isLoading ? 'Processing...' : 'Confirm & Execute'}
      </button>
    </div>
  )
}
