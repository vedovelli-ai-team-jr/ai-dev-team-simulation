import { useEffect, useState } from 'react'
import { useOnboarding } from '../../hooks/useOnboarding'
import { OnboardingStep } from './OnboardingStep'
import { OnboardingProgressBar } from './OnboardingProgressBar'

interface OnboardingWizardProps {
  onComplete?: () => void
}

/**
 * OnboardingWizard component that guides users through setup steps
 * Uses the useOnboarding hook to manage state and mutations
 */
export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const {
    state,
    steps,
    currentStepId,
    currentStep,
    nextStep,
    isCompleted,
    progress,
    isLoadingState,
    isLoadingSteps,
    isCompletingStep,
    completeStepError,
    isSkippingStep,
    skipStepError,
    completeStepAsync,
    skipStepAsync,
    canSkipStep,
  } = useOnboarding()

  const [localError, setLocalError] = useState<string | null>(null)

  // Redirect when onboarding is complete
  useEffect(() => {
    if (isCompleted) {
      onComplete?.()
    }
  }, [isCompleted, onComplete])

  const handleCompleteStep = async () => {
    try {
      setLocalError(null)
      if (currentStepId) {
        await completeStepAsync({
          stepId: currentStepId,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete step'
      setLocalError(message)
    }
  }

  const handleSkipStep = async () => {
    try {
      setLocalError(null)
      if (currentStepId) {
        await skipStepAsync({
          stepId: currentStepId,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to skip step'
      setLocalError(message)
    }
  }

  if (isLoadingState || isLoadingSteps) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">You're all set!</h2>
          <p className="mt-2 text-slate-400">Your onboarding is complete.</p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Let's get you set up</h1>
          <p className="text-slate-400 mb-6">
            Follow these steps to complete your profile and configure your preferences.
          </p>

          {/* Progress Bar */}
          <OnboardingProgressBar
            current={state?.completedSteps.length ?? 0}
            total={steps?.length ?? 5}
            label="Setup Progress"
          />
        </div>

        {/* Error Alert */}
        {(localError || completeStepError || skipStepError) && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {localError ||
                    completeStepError?.message ||
                    skipStepError?.message ||
                    'Something went wrong'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-6">
          {steps?.map((step) => (
            <OnboardingStep
              key={step.id}
              id={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isActive={currentStepId === step.id}
              isCompleted={state?.completedSteps.includes(step.id) ?? false}
              canSkip={step.canSkip}
              onComplete={handleCompleteStep}
              onSkip={handleSkipStep}
              isLoading={isCompletingStep || isSkippingStep}
            >
              {currentStepId === step.id && (
                <div className="text-slate-300 text-sm">
                  {step.id === 'profile_setup' && (
                    <p>Complete your user profile with your name, avatar, and bio.</p>
                  )}
                  {step.id === 'preferences' && (
                    <p>Set your notification and display preferences to customize your experience.</p>
                  )}
                  {step.id === 'integration' && (
                    <p>
                      Connect external tools and services to enhance your workflow (optional).
                    </p>
                  )}
                  {step.id === 'team_setup' && (
                    <p>
                      Invite your team members and assign roles to collaborate effectively (optional).
                    </p>
                  )}
                  {step.id === 'workflow_config' && (
                    <p>Configure your team workflows and processes to match your needs.</p>
                  )}
                </div>
              )}
            </OnboardingStep>
          ))}
        </div>

        {/* Navigation Info */}
        {nextStep && !isCompleted && (
          <div className="mt-8 p-4 rounded-lg bg-blue-50/5 border border-blue-500/20">
            <p className="text-sm text-blue-300">
              Next up: <span className="font-semibold">{nextStep.title}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
