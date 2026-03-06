import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AgentSelector } from '../../components/BulkOps/AgentSelector'
import { OperationForm } from '../../components/BulkOps/OperationForm'
import { ConfirmationStep } from '../../components/BulkOps/ConfirmationStep'
import { useBulkOperation } from '../../hooks/useBulkOperation'
import { RouteErrorBoundary } from '../../components/RouteErrorBoundary'

/* eslint-disable react-refresh/only-export-components */

type BulkOperationStep = 'select-agents' | 'operation-type' | 'operation-details' | 'confirmation'

interface BulkOperationState {
  selectedAgentIds: string[]
  operationType: 'update-settings' | 'assign-tasks'
  operationDetails: Record<string, unknown>
}

function BulkOperationsRoute() {
  const [currentStep, setCurrentStep] = useState<BulkOperationStep>('select-agents')
  const [bulkState, setBulkState] = useState<BulkOperationState>({
    selectedAgentIds: [],
    operationType: 'update-settings',
    operationDetails: {},
  })

  const bulkOp = useBulkOperation({
    onSuccess: () => {
      // Operation succeeded, show success state
    },
    onError: () => {
      // Error will be shown in the hook state
    },
  })

  const handleAgentSelection = (agentIds: string[]) => {
    setBulkState((prev) => ({
      ...prev,
      selectedAgentIds: agentIds,
    }))
  }

  const handleOperationTypeSelect = (type: 'update-settings' | 'assign-tasks') => {
    setBulkState((prev) => ({
      ...prev,
      operationType: type,
    }))
    setCurrentStep('operation-details')
  }

  const handleOperationDetailsSubmit = (details: Record<string, unknown>) => {
    setBulkState((prev) => ({
      ...prev,
      operationDetails: details,
    }))
    setCurrentStep('confirmation')
  }

  const handleConfirmOperation = async () => {
    if (bulkState.operationType === 'update-settings') {
      await bulkOp.submitBulkUpdate(bulkState.selectedAgentIds, bulkState.operationDetails)
    } else {
      const task = {
        id: String(bulkState.operationDetails.taskId),
        name: String(bulkState.operationDetails.taskName),
      }
      await bulkOp.submitBulkAssign(bulkState.selectedAgentIds, task)
    }
  }

  const handleRetry = () => {
    bulkOp.retryAll()
  }

  const handleSkipFailed = () => {
    bulkOp.skipFailed()
  }

  const stepTitles: Record<BulkOperationStep, string> = {
    'select-agents': 'Select Agents',
    'operation-type': 'Choose Operation',
    'operation-details': 'Configure Details',
    confirmation: 'Review & Execute',
  }

  const stepNumbers: Record<BulkOperationStep, number> = {
    'select-agents': 1,
    'operation-type': 2,
    'operation-details': 3,
    confirmation: 4,
  }

  const canProceedToOperationType = bulkState.selectedAgentIds.length > 0

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Agent Operations</h1>
          <p className="text-gray-600 mt-2">Update settings or assign tasks to multiple agents at once</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            {(['select-agents', 'operation-type', 'operation-details', 'confirmation'] as const).map(
              (step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep === step
                        ? 'bg-blue-600 text-white'
                        : stepNumbers[currentStep] > stepNumbers[step]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumbers[currentStep] > stepNumbers[step] ? '✓' : stepNumbers[step]}
                  </div>
                  {index < 3 && (
                    <div
                      className={`h-1 w-12 mx-2 ${
                        stepNumbers[currentStep] > stepNumbers[step] ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              )
            )}
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-900">{stepTitles[currentStep]}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          {currentStep === 'select-agents' && (
            <>
              <AgentSelector
                selectedAgentIds={bulkState.selectedAgentIds}
                onSelectionChange={handleAgentSelection}
              />
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setCurrentStep('operation-type')}
                  disabled={!canProceedToOperationType}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {currentStep === 'operation-type' && (
            <>
              <div className="space-y-4">
                <button
                  onClick={() => handleOperationTypeSelect('update-settings')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-gray-900">Update Agent Settings</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Modify status, capacity, or other agent properties for selected agents
                  </div>
                </button>

                <button
                  onClick={() => handleOperationTypeSelect('assign-tasks')}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-gray-900">Assign Tasks</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Assign the same task to multiple agents at once
                  </div>
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setCurrentStep('select-agents')}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </>
          )}

          {currentStep === 'operation-details' && (
            <>
              <OperationForm
                operationType={bulkState.operationType}
                onSubmit={handleOperationDetailsSubmit}
                isLoading={bulkOp.status === 'running'}
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setCurrentStep('operation-type')}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </>
          )}

          {currentStep === 'confirmation' && (
            <>
              <ConfirmationStep
                operationType={bulkState.operationType}
                agentCount={bulkState.selectedAgentIds.length}
                operationDetails={bulkState.operationDetails}
                status={bulkOp.status}
                error={bulkOp.error}
                successCount={bulkOp.successCount}
                failedAgents={bulkOp.failedAgents}
                totalRequested={bulkOp.totalRequested}
                onConfirm={handleConfirmOperation}
                onRetry={handleRetry}
                onSkipFailed={handleSkipFailed}
                isLoading={bulkOp.status === 'running'}
              />

              {bulkOp.status !== 'success' && bulkOp.status !== 'error' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setCurrentStep('operation-details')}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/agents/bulk-operations')({
  component: BulkOperationsRoute,
  errorComponent: ({ error }) => <RouteErrorBoundary error={error} />,
})
