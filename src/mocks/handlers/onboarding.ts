import { http, HttpResponse } from 'msw'
import type { OnboardingStateResponse, CompleteStepPayload, SkipStepPayload } from '../../types/onboarding'

/**
 * Generate initial onboarding state
 */
function generateInitialOnboarding(): OnboardingStateResponse {
  return {
    userId: 'user-1',
    currentStepId: 'profile_setup',
    completedSteps: [],
    isCompleted: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Define onboarding steps in order
 */
const allSteps = [
  { id: 'profile_setup' as const, canSkip: false },
  { id: 'preferences' as const, canSkip: true },
  { id: 'integration' as const, canSkip: true },
  { id: 'team_setup' as const, canSkip: true },
  { id: 'workflow_config' as const, canSkip: false },
]

/**
 * Get next step after current step
 */
function getNextStep(currentStepId: string): string | null {
  const currentIndex = allSteps.findIndex((s) => s.id === currentStepId)
  if (currentIndex >= 0 && currentIndex < allSteps.length - 1) {
    return allSteps[currentIndex + 1].id
  }
  return null
}

/**
 * In-memory store for onboarding state
 */
let onboardingStore = generateInitialOnboarding()

export const onboardingHandlers = [
  /**
   * GET /api/onboarding/state
   * Fetch current user's onboarding state
   */
  http.get('/api/onboarding/state', () => {
    return HttpResponse.json({
      data: onboardingStore,
      success: true,
    })
  }),

  /**
   * POST /api/onboarding/complete-step
   * Mark a step as completed and advance to next step
   */
  http.post('/api/onboarding/complete-step', async ({ request }) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const payload = (await request.json()) as CompleteStepPayload

    // Add to completed steps if not already there
    if (!onboardingStore.completedSteps.includes(payload.stepId)) {
      onboardingStore.completedSteps.push(payload.stepId)
    }

    // Determine next step
    const nextStep = getNextStep(payload.stepId)

    // Update state
    const updated: OnboardingStateResponse = {
      ...onboardingStore,
      currentStepId: (nextStep ?? payload.stepId) as any,
      completedSteps: onboardingStore.completedSteps,
      isCompleted: nextStep === null,
      updatedAt: new Date().toISOString(),
    }

    onboardingStore = updated

    return HttpResponse.json({
      data: updated,
      success: true,
    })
  }),

  /**
   * POST /api/onboarding/skip-step
   * Skip a step that allows skipping
   */
  http.post('/api/onboarding/skip-step', async ({ request }) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const payload = (await request.json()) as SkipStepPayload

    // Check if step can be skipped
    const step = allSteps.find((s) => s.id === payload.stepId)
    if (!step?.canSkip) {
      return HttpResponse.json(
        {
          success: false,
          error: `Step ${payload.stepId} cannot be skipped`,
          code: 'CANNOT_SKIP_STEP',
        },
        { status: 400 }
      )
    }

    // Determine next step
    const nextStep = getNextStep(payload.stepId)

    // Update state without marking as completed
    const updated: OnboardingStateResponse = {
      ...onboardingStore,
      currentStepId: (nextStep ?? payload.stepId) as any,
      isCompleted: nextStep === null,
      updatedAt: new Date().toISOString(),
    }

    onboardingStore = updated

    return HttpResponse.json({
      data: updated,
      success: true,
    })
  }),

  /**
   * POST /api/onboarding/reset
   * Reset onboarding to initial state
   * Useful for testing or user choice to restart
   */
  http.post('/api/onboarding/reset', () => {
    onboardingStore = generateInitialOnboarding()

    return HttpResponse.json({
      data: onboardingStore,
      success: true,
    })
  }),

  /**
   * GET /api/onboarding/steps
   * Get all available onboarding steps with metadata
   */
  http.get('/api/onboarding/steps', () => {
    const steps = [
      {
        id: 'profile_setup',
        title: 'Complete Your Profile',
        description: 'Add your name, avatar, and bio to get started',
        order: 1,
        canSkip: false,
        isCompleted: onboardingStore.completedSteps.includes('profile_setup'),
        icon: '👤',
      },
      {
        id: 'preferences',
        title: 'Set Your Preferences',
        description: 'Configure notification and display preferences',
        order: 2,
        canSkip: true,
        isCompleted: onboardingStore.completedSteps.includes('preferences'),
        icon: '⚙️',
      },
      {
        id: 'integration',
        title: 'Connect Integrations',
        description: 'Link external tools and services (optional)',
        order: 3,
        canSkip: true,
        isCompleted: onboardingStore.completedSteps.includes('integration'),
        icon: '🔗',
      },
      {
        id: 'team_setup',
        title: 'Invite Team Members',
        description: 'Add your team and set roles (optional)',
        order: 4,
        canSkip: true,
        isCompleted: onboardingStore.completedSteps.includes('team_setup'),
        icon: '👥',
      },
      {
        id: 'workflow_config',
        title: 'Configure Workflows',
        description: 'Set up your team workflows and processes',
        order: 5,
        canSkip: false,
        isCompleted: onboardingStore.completedSteps.includes('workflow_config'),
        icon: '🔄',
      },
    ]

    return HttpResponse.json({
      data: steps,
      success: true,
    })
  }),
]
