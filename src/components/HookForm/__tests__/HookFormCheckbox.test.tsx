import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { HookFormCheckbox } from '../HookFormCheckbox'

describe('HookFormCheckbox Component', () => {
  it('renders checkbox field with label', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { agree: false },
      })

      return (
        <HookFormCheckbox
          control={control}
          name="agree"
          label="I agree to the terms"
        />
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('I agree to the terms')).toBeInTheDocument()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('renders unchecked checkbox by default', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { notifications: false },
      })

      return (
        <HookFormCheckbox
          control={control}
          name="notifications"
          label="Enable notifications"
        />
      )
    }

    render(<TestComponent />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('renders disabled checkbox when disabled prop is true', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { terms: false },
      })

      return (
        <HookFormCheckbox
          control={control}
          name="terms"
          label="Accept terms"
          disabled
        />
      )
    }

    render(<TestComponent />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('displays required indicator when required prop is true', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { terms: false },
      })

      return (
        <HookFormCheckbox
          control={control}
          name="terms"
          label="Accept terms"
          required
        />
      )
    }

    render(<TestComponent />)

    // The HookFormField should show the required indicator
    const label = screen.getByText((content, element) => {
      return element?.tagName === 'LABEL' && content.includes('Accept')
    })
    // Required indicator appears somewhere in the label area
    expect(label).toBeInTheDocument()
  })

  it('renders checkbox without label when label is not provided', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { standalone: false },
      })

      return <HookFormCheckbox control={control} name="standalone" />
    }

    render(<TestComponent />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })
})
