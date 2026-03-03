import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  role: z
    .string()
    .min(1, 'Role is required')
    .refine((val) => ['admin', 'user', 'viewer'].includes(val), {
      message: 'Invalid role selected',
    }),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const createUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string().datetime(),
})

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>
