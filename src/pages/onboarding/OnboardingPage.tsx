import { useRouter } from '@tanstack/react-router'
import { OnboardingWizard } from '../../components/Onboarding'

/**
 * Onboarding page that guides new users through setup
 * Redirects to dashboard when onboarding is complete
 */
export function OnboardingPage() {
  const router = useRouter()

  const handleOnboardingComplete = () => {
    // Redirect to dashboard or home page after onboarding
    router.navigate({ to: '/' })
  }

  return <OnboardingWizard onComplete={handleOnboardingComplete} />
}
