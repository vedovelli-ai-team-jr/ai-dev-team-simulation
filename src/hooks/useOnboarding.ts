import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  OnboardingStateResponse,
  OnboardingStep,
  CompleteStepPayload,
  SkipStepPayload,
} from '../types/onboarding'
import { useMutationWithRetry } from './useMutationWithRetry'

/**
 * Configuration options for useOnboarding hook
 */
export interface UseOnboardingOptions {
  /** Enable automatic refetch on window focus (default: true) */
  refetchOnWindowFocus?: boolean
}

/**
 * Fetch and manage user's onboarding flow
 *
 * Features:
 * - Caches onboarding state with 5min stale time
 * - Mutations for completing and skipping steps
 * - Automatic progression to next step
 * - Step metadata fetch
 * - Error handling for non-skippable steps
 * - Exponential backoff retry logic
 */
export function useOnboarding(options: UseOnboardingOptions = {}) {
  const { refetchOnWindowFocus = true } = options

  const queryClient = useQueryClient()

  // Query to fetch onboarding state
  const stateQuery = useQuery<OnboardingStateResponse, Error>({
    queryKey: ['onboarding', 'state'],
    queryFn: async () => {
      const response = await fetch('/api/onboarding/state', {
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch onboarding state: ${response.statusText}`)
      }

      return response.json() as Promise<OnboardingStateResponse>
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  // Query to fetch available steps
  const stepsQuery = useQuery<OnboardingStep[], Error>({
    queryKey: ['onboarding', 'steps'],
    queryFn: async () => {
      const response = await fetch('/api/onboarding/steps', {
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch onboarding steps: ${response.statusText}`)
      }

      return response.json() as Promise<{ data: OnboardingStep[] }>
        .then((r) => r.data)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  })

  // Mutation for completing a step
  const completeStepMutation = useMutationWithRetry<
    OnboardingStateResponse,
    CompleteStepPayload
  >({
    mutationFn: async (payload) => {
      const response = await fetch('/api/onboarding/complete-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as any
        throw new Error(errorData.error || 'Failed to complete step')
      }

      return response.json() as Promise<{ data: OnboardingStateResponse }>
        .then((r) => r.data)
    },
    onMutate: async (payload) => {
      // Cancel any pending requests
      await queryClient.cancelQueries({ queryKey: ['onboarding'] })

      // Snapshot previous state
      const previousState = queryClient.getQueryData<OnboardingStateResponse>([
        'onboarding',
        'state',
      ])

      // Optimistically update (mark step as completed)
      if (previousState) {
        const completed = new Set(previousState.completedSteps)
        completed.add(payload.stepId)

        const optimisticState: OnboardingStateResponse = {
          ...previousState,
          completedSteps: Array.from(completed),
        }
        queryClient.setQueryData(['onboarding', 'state'], optimisticState)
      }

      return { previousState }
    },
    onError: (_error, _payload, context) => {
      // Rollback to previous state on error
      if (context?.previousState) {
        queryClient.setQueryData(['onboarding', 'state'], context.previousState)
      }
    },
    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(['onboarding', 'state'], data)
    },
  })

  // Mutation for skipping a step
  const skipStepMutation = useMutationWithRetry<OnboardingStateResponse, SkipStepPayload>({
    mutationFn: async (payload) => {
      const response = await fetch('/api/onboarding/skip-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as any
        const error = new Error(errorData.error || 'Failed to skip step')
        ;(error as any).code = errorData.code
        throw error
      }

      return response.json() as Promise<{ data: OnboardingStateResponse }>
        .then((r) => r.data)
    },
    onMutate: async (payload) => {
      // Cancel any pending requests
      await queryClient.cancelQueries({ queryKey: ['onboarding'] })

      // Snapshot previous state
      const previousState = queryClient.getQueryData<OnboardingStateResponse>([
        'onboarding',
        'state',
      ])

      return { previousState }
    },
    onError: (_error, _payload, context) => {
      // Rollback to previous state on error
      if (context?.previousState) {
        queryClient.setQueryData(['onboarding', 'state'], context.previousState)
      }
    },
    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(['onboarding', 'state'], data)
    },
  })

  // Mutation for resetting onboarding
  const resetMutation = useMutationWithRetry<OnboardingStateResponse, void>({
    mutationFn: async () => {
      const response = await fetch('/api/onboarding/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to reset onboarding')
      }

      return response.json() as Promise<{ data: OnboardingStateResponse }>
        .then((r) => r.data)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding', 'state'], data)
    },
  })

  // Helper to check if a step can be skipped
  const canSkipStep = (stepId: string): boolean => {
    const step = stepsQuery.data?.find((s) => s.id === stepId)
    return step?.canSkip ?? false
  }

  // Helper to get next step
  const getNextStep = (): OnboardingStep | null => {
    if (!stateQuery.data || !stepsQuery.data) return null

    const allSteps = stepsQuery.data.sort((a, b) => a.order - b.order)
    const currentIndex = allSteps.findIndex((s) => s.id === stateQuery.data.currentStepId)

    if (currentIndex >= 0 && currentIndex < allSteps.length - 1) {
      return allSteps[currentIndex + 1]
    }

    return null
  }

  return {
    // State query
    state: stateQuery.data,
    isLoadingState: stateQuery.isLoading,
    stateError: stateQuery.error,

    // Steps query
    steps: stepsQuery.data,
    isLoadingSteps: stepsQuery.isLoading,
    stepsError: stepsQuery.error,

    // Current step
    currentStepId: stateQuery.data?.currentStepId,
    currentStep: stepsQuery.data?.find((s) => s.id === stateQuery.data?.currentStepId),
    nextStep: getNextStep(),

    // Completion status
    isCompleted: stateQuery.data?.isCompleted ?? false,
    completedSteps: stateQuery.data?.completedSteps ?? [],
    progress: stepsQuery.data
      ? Math.round(((stateQuery.data?.completedSteps.length ?? 0) / stepsQuery.data.length) * 100)
      : 0,

    // Mutations
    completeStep: completeStepMutation.mutate,
    completeStepAsync: completeStepMutation.mutateAsync,
    isCompletingStep: completeStepMutation.isPending,
    completeStepError: completeStepMutation.error,

    skipStep: skipStepMutation.mutate,
    skipStepAsync: skipStepMutation.mutateAsync,
    isSkippingStep: skipStepMutation.isPending,
    skipStepError: skipStepMutation.error,
    canSkipStep,

    resetOnboarding: resetMutation.mutate,
    resetOnboardingAsync: resetMutation.mutateAsync,
    isResettingOnboarding: resetMutation.isPending,

    // Utilities
    refetch: stateQuery.refetch,
    refetchSteps: stepsQuery.refetch,
  }
}

export type UseOnboardingReturn = ReturnType<typeof useOnboarding>
