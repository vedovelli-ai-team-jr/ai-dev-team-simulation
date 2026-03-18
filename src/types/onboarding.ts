import { z } from 'zod'

export type OnboardingStepType =
  | 'profile_setup'
  | 'preferences'
  | 'integration'
  | 'team_setup'
  | 'workflow_config'

export interface OnboardingStep {
  id: OnboardingStepType
  title: string
  description: string
  order: number
  canSkip: boolean
  isCompleted: boolean
  icon?: string
}

export interface OnboardingState {
  userId: string
  currentStepId: OnboardingStepType
  completedSteps: OnboardingStepType[]
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface CompleteStepPayload {
  stepId: OnboardingStepType
  data?: Record<string, unknown>
}

export interface SkipStepPayload {
  stepId: OnboardingStepType
}

export const onboardingStateSchema = z.object({
  userId: z.string(),
  currentStepId: z.enum([
    'profile_setup',
    'preferences',
    'integration',
    'team_setup',
    'workflow_config',
  ]),
  completedSteps: z.array(
    z.enum([
      'profile_setup',
      'preferences',
      'integration',
      'team_setup',
      'workflow_config',
    ])
  ),
  isCompleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type OnboardingStateResponse = z.infer<typeof onboardingStateSchema>
