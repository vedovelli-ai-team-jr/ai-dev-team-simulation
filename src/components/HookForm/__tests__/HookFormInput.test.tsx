import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { HookFormInput } from '../HookFormInput'

describe('HookFormInput Component', () => {
  it('renders input field with label', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { username: '' },
      })

      return (
        <HookFormInput
          control={control}
          name="username"
          label="Username"
          placeholder="Enter username"
        />
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('Username')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Enter username')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders email input type', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { email: '' },
      })

      return (
        <HookFormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
        />
      )
    }

    render(<TestComponent />)

    const input = screen.getByPlaceholderText('your@email.com')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders disabled input when disabled prop is true', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { username: '' },
      })

      return (
        <HookFormInput
          control={control}
          name="username"
          label="Username"
          disabled
        />
      )
    }

    render(<TestComponent />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('renders number input with min and step', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { hours: 0 },
      })

      return (
        <HookFormInput
          control={control}
          name="hours"
          label="Hours"
          type="number"
          min="0"
          step="0.5"
        />
      )
    }

    render(<TestComponent />)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('step', '0.5')
  })

  it('displays required indicator when required prop is true', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { username: '' },
      })

      return (
        <HookFormInput
          control={control}
          name="username"
          label="Username"
          required
        />
      )
    }

    render(<TestComponent />)

    const label = screen.getByText((content, element) => {
      return element?.tagName === 'LABEL' && content.includes('Username')
    })
    expect(label).toBeInTheDocument()
    expect(label.textContent).toContain('*')
  })
})
