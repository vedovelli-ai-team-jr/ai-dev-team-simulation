import { useForm as useTanstackForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { ZodSchema } from 'zod'

interface UseFormConfig<T> {
  defaultValues: T
  schema: ZodSchema
  onSubmit: (data: T) => Promise<void>
}

/**
 * Generic form hook wrapper around TanStack Form
 * Provides validation with Zod and handles form submission
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * })
 *
 * const form = useForm({
 *   defaultValues: { email: '', password: '' },
 *   schema,
 *   onSubmit: async (data) => {
 *     await api.submit(data)
 *   },
 * })
 * ```
 */
export function useForm<T>({
  defaultValues,
  schema,
  onSubmit,
}: UseFormConfig<T>) {
  const form = useTanstackForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  })

  return form
}
