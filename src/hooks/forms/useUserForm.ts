import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { createUserSchema, type CreateUserInput } from '@/types/forms/user'

interface UseUserFormOptions {
  onSubmit: (data: CreateUserInput) => Promise<void>
}

export function useUserForm({ onSubmit }: UseUserFormOptions) {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: '',
    } as CreateUserInput,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createUserSchema,
    },
  })

  return form
}
