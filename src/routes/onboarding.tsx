import { createFileRoute } from '@tanstack/react-router'
import { OnboardingPage } from '../pages/onboarding/OnboardingPage'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})
