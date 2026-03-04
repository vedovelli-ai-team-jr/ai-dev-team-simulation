import { useForm } from '../useForm'
import { z } from 'zod'
import { useState } from 'react'

/**
 * Validation schema for registration form
 * Includes async validation for email and username uniqueness
 */
const registrationSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .refine(
        async (email) => {
          // Simulate checking email availability via API
          const response = await fetch('/api/auth/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          })
          const data = await response.json()
          return data.available !== false
        },
        'Email already in use',
      ),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be no more than 20 characters')
      .refine(
        async (username) => {
          // Simulate checking username availability via API
          const response = await fetch('/api/auth/check-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          })
          const data = await response.json()
          return data.available !== false
        },
        'Username already taken',
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(
        (pwd) => /[A-Z]/.test(pwd),
        'Password must contain at least one uppercase letter',
      )
      .refine(
        (pwd) => /[a-z]/.test(pwd),
        'Password must contain at least one lowercase letter',
      )
      .refine(
        (pwd) => /[0-9]/.test(pwd),
        'Password must contain at least one number',
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine(
      (val) => val === true,
      'You must agree to the terms and conditions',
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegistrationFormData = z.infer<typeof registrationSchema>

/**
 * Complex registration form example
 *
 * Demonstrates:
 * - Multiple validation rules per field
 * - Async validation (email/username uniqueness)
 * - Cross-field validation (password confirmation)
 * - Conditional field validation
 * - Error state management
 * - Loading states during async operations
 */
export function RegistrationFormExample() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validatingFields, setValidatingFields] = useState<Set<string>>(
    new Set(),
  )

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    schema: registrationSchema,
    onSubmit: async (data: RegistrationFormData) => {
      try {
        setIsSubmitting(true)
        setSubmitError(null)
        setSuccessMessage(null)

        // Simulate API call to register endpoint
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Registration failed')
        }

        setSuccessMessage('Registration successful! You can now log in.')
        form.reset()
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'An error occurred',
        )
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const handleAsyncValidation = async (fieldName: string) => {
    setValidatingFields((prev) => new Set([...prev, fieldName]))
    try {
      await form.validateFieldIfNeeded(fieldName)
    } finally {
      setValidatingFields((prev) => {
        const next = new Set(prev)
        next.delete(fieldName)
        return next
      })
    }
  }

  const getFieldError = (fieldName: keyof RegistrationFormData) => {
    return form.state.fieldMeta(fieldName)?.errors?.[0]
  }

  const isFieldValidating = (fieldName: string) => {
    return validatingFields.has(fieldName)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="max-w-md mx-auto space-y-4 p-6"
    >
      <h2 className="text-2xl font-bold">Create Account</h2>

      {submitError && (
        <div
          className="bg-red-50 text-red-700 p-3 rounded border border-red-200"
          role="alert"
        >
          {submitError}
        </div>
      )}

      {successMessage && (
        <div
          className="bg-green-50 text-green-700 p-3 rounded border border-green-200"
          role="alert"
        >
          {successMessage}
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            value={form.state.values.firstName}
            onChange={(e) => form.setFieldValue('firstName', e.target.value)}
            onBlur={() => handleAsyncValidation('firstName')}
            className={`w-full px-3 py-2 border rounded ${
              getFieldError('firstName')
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {getFieldError('firstName') && (
            <span className="text-red-500 text-sm mt-1">
              {getFieldError('firstName')}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={form.state.values.lastName}
            onChange={(e) => form.setFieldValue('lastName', e.target.value)}
            onBlur={() => handleAsyncValidation('lastName')}
            className={`w-full px-3 py-2 border rounded ${
              getFieldError('lastName') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {getFieldError('lastName') && (
            <span className="text-red-500 text-sm mt-1">
              {getFieldError('lastName')}
            </span>
          )}
        </div>
      </div>

      {/* Email field with async validation */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={form.state.values.email}
            onChange={(e) => form.setFieldValue('email', e.target.value)}
            onBlur={() => handleAsyncValidation('email')}
            disabled={isFieldValidating('email')}
            className={`w-full px-3 py-2 border rounded ${
              getFieldError('email') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {isFieldValidating('email') && (
            <span className="absolute right-3 top-2 text-gray-400">...</span>
          )}
        </div>
        {getFieldError('email') && (
          <span className="text-red-500 text-sm mt-1">
            {getFieldError('email')}
          </span>
        )}
      </div>

      {/* Username field with async validation */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            placeholder="johndoe"
            value={form.state.values.username}
            onChange={(e) => form.setFieldValue('username', e.target.value)}
            onBlur={() => handleAsyncValidation('username')}
            disabled={isFieldValidating('username')}
            className={`w-full px-3 py-2 border rounded ${
              getFieldError('username')
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {isFieldValidating('username') && (
            <span className="absolute right-3 top-2 text-gray-400">...</span>
          )}
        </div>
        {getFieldError('username') && (
          <span className="text-red-500 text-sm mt-1">
            {getFieldError('username')}
          </span>
        )}
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={form.state.values.password}
          onChange={(e) => form.setFieldValue('password', e.target.value)}
          onBlur={() => handleAsyncValidation('password')}
          className={`w-full px-3 py-2 border rounded ${
            getFieldError('password') ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {getFieldError('password') && (
          <span className="text-red-500 text-sm mt-1">
            {getFieldError('password')}
          </span>
        )}
      </div>

      {/* Confirm Password field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={form.state.values.confirmPassword}
          onChange={(e) =>
            form.setFieldValue('confirmPassword', e.target.value)
          }
          onBlur={() => handleAsyncValidation('confirmPassword')}
          className={`w-full px-3 py-2 border rounded ${
            getFieldError('confirmPassword')
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {getFieldError('confirmPassword') && (
          <span className="text-red-500 text-sm mt-1">
            {getFieldError('confirmPassword')}
          </span>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="flex items-start gap-2">
        <input
          id="agreeToTerms"
          type="checkbox"
          checked={form.state.values.agreeToTerms}
          onChange={(e) =>
            form.setFieldValue('agreeToTerms', e.target.checked)
          }
          className="mt-1"
        />
        <label htmlFor="agreeToTerms" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
      {getFieldError('agreeToTerms') && (
        <span className="text-red-500 text-sm">
          {getFieldError('agreeToTerms')}
        </span>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={
          !form.state.isValid ||
          isSubmitting ||
          validatingFields.size > 0
        }
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Validation status indicator */}
      <div className="text-xs text-gray-500 text-center">
        {validatingFields.size > 0 && (
          <p>Validating {Array.from(validatingFields).join(', ')}...</p>
        )}
        {!form.state.isValid && !isSubmitting && validatingFields.size === 0 && (
          <p>Please fix validation errors</p>
        )}
      </div>
    </form>
  )
}
