import { render, screen, fireEvent } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { HookForm } from '../HookForm'

describe('HookForm Component', () => {
  it('renders form with children and submit button', () => {
    const TestForm = () => {
      const { handleSubmit } = useForm({
        defaultValues: { name: '' },
      })

      return (
        <HookForm onSubmit={handleSubmit(() => {})}>
          <div>Test Field</div>
        </HookForm>
      )
    }

    render(<TestForm />)

    expect(screen.getByText('Test Field')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('calls onSubmit when form is submitted', async () => {
    const mockSubmit = jest.fn()

    const TestForm = () => {
      const { handleSubmit } = useForm({
        defaultValues: { name: '' },
      })

      return (
        <HookForm onSubmit={handleSubmit(mockSubmit)}>
          <div>Test Field</div>
        </HookForm>
      )
    }

    render(<TestForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)

    // Give async handlers time to process
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(submitButton).toBeInTheDocument()
  })

  it('displays custom submit label', () => {
    const TestForm = () => {
      const { handleSubmit } = useForm({
        defaultValues: { name: '' },
      })

      return (
        <HookForm onSubmit={handleSubmit(() => {})} submitLabel="Save Changes">
          <div>Test Field</div>
        </HookForm>
      )
    }

    render(<TestForm />)
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument()
  })

  it('disables submit button when loading is true', () => {
    const TestForm = () => {
      const { handleSubmit } = useForm({
        defaultValues: { name: '' },
      })

      return (
        <HookForm
          onSubmit={handleSubmit(() => {})}
          isLoading={true}
        >
          <div>Test Field</div>
        </HookForm>
      )
    }

    render(<TestForm />)

    const submitButton = screen.getByRole('button', { name: /loading/i })
    expect(submitButton).toBeDisabled()
  })

  it('shows loading text when isLoading is true', () => {
    const TestForm = () => {
      const { handleSubmit } = useForm({
        defaultValues: { name: '' },
      })

      return (
        <HookForm
          onSubmit={handleSubmit(() => {})}
          isLoading={true}
          submitLabel="Submit"
        >
          <div>Test Field</div>
        </HookForm>
      )
    }

    render(<TestForm />)

    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
  })

  it('applies custom className to form', () => {
    const TestForm = () => {
      const { handleSubmit } = useForm({
        defaultValues: { name: '' },
      })

      return (
        <HookForm
          onSubmit={handleSubmit(() => {})}
          className="custom-form-class"
        >
          <div>Test Field</div>
        </HookForm>
      )
    }

    const { container } = render(<TestForm />)
    const formElement = container.querySelector('form')

    expect(formElement).toHaveClass('custom-form-class')
  })
})
