import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { HookFormSelect } from '../HookFormSelect'

describe('HookFormSelect Component', () => {
  it('renders select field with label and options', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { status: '' },
      })

      return (
        <HookFormSelect
          control={control}
          name="status"
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('renders all provided options', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { priority: '' },
      })

      return (
        <HookFormSelect
          control={control}
          name="priority"
          label="Priority"
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders placeholder option when provided', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { category: '' },
      })

      return (
        <HookFormSelect
          control={control}
          name="category"
          label="Category"
          placeholder="Select a category"
          options={[
            { value: 'cat1', label: 'Category 1' },
            { value: 'cat2', label: 'Category 2' },
          ]}
        />
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('Select a category')).toBeInTheDocument()
  })

  it('renders disabled select when disabled prop is true', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { status: '' },
      })

      return (
        <HookFormSelect
          control={control}
          name="status"
          label="Status"
          disabled
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      )
    }

    render(<TestComponent />)

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('displays required indicator when required prop is true', () => {
    const TestComponent = () => {
      const { control } = useForm({
        defaultValues: { status: '' },
      })

      return (
        <HookFormSelect
          control={control}
          name="status"
          label="Status"
          required
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      )
    }

    render(<TestComponent />)

    const label = screen.getByText((content, element) => {
      return element?.tagName === 'LABEL' && content.includes('Status')
    })
    expect(label).toBeInTheDocument()
    expect(label.textContent).toContain('*')
  })
})
