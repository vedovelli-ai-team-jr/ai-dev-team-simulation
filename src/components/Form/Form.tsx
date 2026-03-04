import { ReactNode } from 'react'
import { FormApi } from '@tanstack/react-form'

interface FormProps<T> {
  form: FormApi<T, any>
  onSubmit?: (e: React.FormEvent) => void
  children: ReactNode
  className?: string
  submitLabel?: string
  isLoading?: boolean
}

export function Form<T>({
  form,
  onSubmit,
  children,
  className = '',
  submitLabel = 'Submit',
  isLoading = false,
}: FormProps<T>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
        onSubmit?.(e)
      }}
      className={`flex flex-col gap-6 ${className}`}
    >
      {children}
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Loading...' : submitLabel}
      </button>
    </form>
  )
}
