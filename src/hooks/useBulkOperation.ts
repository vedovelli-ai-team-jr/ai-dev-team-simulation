import { useState, useRef, useCallback } from 'react'

export type BulkOperationType = 'update-settings' | 'assign-tasks'

export interface BulkOperationState {
  status: 'idle' | 'running' | 'success' | 'error'
  error: string | null
  successCount: number
  failedAgents: string[]
  totalRequested: number
}

export interface UseBulkOperationOptions {
  onSuccess?: (result: { successCount: number; failedAgents: string[] }) => void
  onError?: (error: Error) => void
}

/**
 * Custom hook for handling bulk agent operations with error recovery
 */
export function useBulkOperation(options?: UseBulkOperationOptions) {
  const [state, setState] = useState<BulkOperationState>({
    status: 'idle',
    error: null,
    successCount: 0,
    failedAgents: [],
    totalRequested: 0,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const submitBulkUpdate = useCallback(
    async (agentIds: string[], updates: Record<string, unknown>) => {
      abortControllerRef.current = new AbortController()

      setState({
        status: 'running',
        error: null,
        successCount: 0,
        failedAgents: [],
        totalRequested: agentIds.length,
      })

      try {
        const response = await fetch('/api/agents/bulk-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentIds, updates }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          setState({
            status: 'error',
            error: errorData.error || 'Failed to update agents',
            successCount: errorData.successCount || 0,
            failedAgents: errorData.failedAgents || [],
            totalRequested: agentIds.length,
          })

          if (options?.onError) {
            options.onError(new Error(errorData.error || 'Bulk update failed'))
          }
          return
        }

        const data = await response.json()
        setState({
          status: 'success',
          error: null,
          successCount: data.updatedCount,
          failedAgents: [],
          totalRequested: agentIds.length,
        })

        if (options?.onSuccess) {
          options.onSuccess({
            successCount: data.updatedCount,
            failedAgents: [],
          })
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          const err = error instanceof Error ? error : new Error('Unknown error')
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: err.message,
          }))
          if (options?.onError) {
            options.onError(err)
          }
        }
      }
    },
    [options]
  )

  const submitBulkAssign = useCallback(
    async (agentIds: string[], task: { id: string; name: string }) => {
      abortControllerRef.current = new AbortController()

      setState({
        status: 'running',
        error: null,
        successCount: 0,
        failedAgents: [],
        totalRequested: agentIds.length,
      })

      try {
        const response = await fetch('/api/agents/bulk-assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentIds, task }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          setState({
            status: 'error',
            error: errorData.error || 'Failed to assign task',
            successCount: errorData.successCount || 0,
            failedAgents: errorData.failedAgents || [],
            totalRequested: agentIds.length,
          })

          if (options?.onError) {
            options.onError(new Error(errorData.error || 'Bulk assign failed'))
          }
          return
        }

        const data = await response.json()
        setState({
          status: 'success',
          error: null,
          successCount: data.assignedCount,
          failedAgents: [],
          totalRequested: agentIds.length,
        })

        if (options?.onSuccess) {
          options.onSuccess({
            successCount: data.assignedCount,
            failedAgents: [],
          })
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          const err = error instanceof Error ? error : new Error('Unknown error')
          setState((prev) => ({
            ...prev,
            status: 'error',
            error: err.message,
          }))
          if (options?.onError) {
            options.onError(err)
          }
        }
      }
    },
    [options]
  )

  const retryAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'idle',
      error: null,
    }))
  }, [])

  const skipFailed = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'success',
      error: null,
    }))
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState({
      status: 'idle',
      error: null,
      successCount: 0,
      failedAgents: [],
      totalRequested: 0,
    })
  }, [])

  return {
    ...state,
    submitBulkUpdate,
    submitBulkAssign,
    retryAll,
    skipFailed,
    cancel,
  }
}
