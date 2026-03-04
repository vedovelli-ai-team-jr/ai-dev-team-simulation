# Validated Form Infrastructure with TanStack Form

This guide covers the reusable form system implemented with TanStack Form, Zod validation, and MSW mocks.

## Overview

The form infrastructure provides:

- **TanStack Form hooks** - Composable form management with type-safe validation
- **Zod validation** - Runtime type checking and schema validation
- **Field-level & form-level validation** - Both onChange and onBlur patterns
- **Async validation support** - For server-side validation (e.g., email uniqueness)
- **Error state management** - User-friendly error messages
- **MSW integration** - Realistic form submission endpoints
- **Practical patterns** - Simple forms for basic cases, complex forms for advanced scenarios

## Architecture

### Custom Hooks

The form system is built on four main hooks:

#### 1. `useForm` - Generic Form Wrapper

The simplest form hook, wrapping TanStack Form with Zod validation:

```tsx
import { useForm } from '@/hooks/forms'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

function MyForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    schema,
    onSubmit: async (data) => {
      await api.submit(data)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <input
        value={form.state.values.email}
        onChange={(e) => form.setFieldValue('email', e.target.value)}
        onBlur={() => form.validateFieldIfNeeded('email')}
      />
      {form.state.fieldMeta('email')?.errors?.[0] && (
        <span className="text-red-500">
          {form.state.fieldMeta('email').errors[0]}
        </span>
      )}
      <button type="submit" disabled={!form.state.isValid}>Submit</button>
    </form>
  )
}
```

#### 2. `useLoginForm` - Pre-configured Login

Specialized hook for login forms with email/password validation:

```tsx
import { useLoginForm, type LoginFormData } from '@/hooks/forms'

function LoginPage() {
  const form = useLoginForm({
    onSubmit: async (data: LoginFormData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Login failed')
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      {/* email and password fields */}
    </form>
  )
}
```

#### 3. `useFilterForm` - Complex Filter Forms

For multi-field filters with URL synchronization and debouncing:

```tsx
import { useFilterForm } from '@/hooks/forms'

function FilteredList() {
  const form = useFilterForm({
    onFiltersChange: async (filters) => {
      const results = await api.search(filters)
      setResults(results)
    },
    debounceMs: 300,
  })

  return (
    <form>
      {/* search, status, date range, sort fields */}
    </form>
  )
}
```

#### 4. `useCrudForm` - Create/Update Forms

For forms that handle both create and update modes:

```tsx
import { useCrudForm } from '@/hooks/forms'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
})

function UserForm({ userId }: { userId?: string }) {
  const mode = userId ? 'update' : 'create'

  const form = useCrudForm({
    schema: userSchema,
    defaultValues: { name: '', email: '' },
    initialData: userId ? existingUser : undefined,
    mode,
    onSubmit: async (data, mode) => {
      if (mode === 'create') {
        await api.createUser(data)
      } else {
        await api.updateUser(userId, data)
      }
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      {/* form fields */}
      <button>{form.state.mode === 'create' ? 'Create' : 'Update'}</button>
    </form>
  )
}
```

## Validation Patterns

### Field-Level Validation

Validate individual fields as user interacts:

```tsx
<input
  value={form.state.values.email}
  onChange={(e) => form.setFieldValue('email', e.target.value)}
  onBlur={() => form.validateFieldIfNeeded('email')}
/>
```

### Form-Level Validation

Validate entire form on submit:

```tsx
const form = useForm({
  defaultValues: { /* ... */ },
  schema, // Applied to entire form
  onSubmit: async ({ value }) => {
    // value is guaranteed to match schema
    await api.submit(value)
  },
})
```

### Async Validation

For server-side checks like email uniqueness:

```tsx
const registrationSchema = z.object({
  email: z
    .string()
    .email('Invalid email')
    .refine(
      async (email) => {
        const exists = await api.checkEmailExists(email)
        return !exists
      },
      'Email already in use',
    ),
  username: z
    .string()
    .min(3)
    .refine(
      async (username) => {
        const available = await api.checkUsernameAvailable(username)
        return available
      },
      'Username taken',
    ),
})

function RegistrationForm() {
  const form = useForm({
    schema: registrationSchema,
    defaultValues: { email: '', username: '' },
    onSubmit: async (data) => {
      await api.register(data)
    },
  })

  // Add onBlur async validation for fields
  return (
    <>
      <input
        value={form.state.values.email}
        onChange={(e) => form.setFieldValue('email', e.target.value)}
        onBlur={() => form.validateFieldIfNeeded('email')}
      />
    </>
  )
}
```

## Error State Management

Errors are automatically extracted from Zod validation:

```tsx
// Single field error
const emailError = form.state.fieldMeta('email')?.errors?.[0]

// All errors for a field
const allEmailErrors = form.state.fieldMeta('email')?.errors

// Form-level error (if validation fails)
const isValid = form.state.isValid

// Display error
{emailError && <span className="text-red-500">{emailError}</span>}
```

## Simple vs Complex Forms

### Simple Form (Login)

Use `useLoginForm` for straightforward email/password patterns:

```tsx
export function LoginFormExample() {
  const form = useLoginForm({
    onSubmit: async (data) => {
      await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <input
        type="email"
        value={form.state.values.email}
        onChange={(e) => form.setFieldValue('email', e.target.value)}
      />
      <input
        type="password"
        value={form.state.values.password}
        onChange={(e) => form.setFieldValue('password', e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Complex Form (Registration)

Use custom `useForm` with rich Zod schema for complex scenarios:

```tsx
const registrationSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().refine(
    (date) => new Date(date) < new Date(),
    'Invalid date',
  ),
  agreeToTerms: z.boolean().refine(
    (val) => val === true,
    'You must agree to terms',
  ),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function RegistrationFormExample() {
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      agreeToTerms: false,
    },
    schema: registrationSchema,
    onSubmit: async (data) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Registration failed')
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {/* Email field with async validation */}
      <div>
        <label>Email</label>
        <input
          type="email"
          value={form.state.values.email}
          onChange={(e) => form.setFieldValue('email', e.target.value)}
          onBlur={() => form.validateFieldIfNeeded('email')}
        />
        {form.state.fieldMeta('email')?.errors?.[0] && (
          <span className="text-red-500">
            {form.state.fieldMeta('email').errors[0]}
          </span>
        )}
      </div>

      {/* Password fields with cross-field validation */}
      <div>
        <label>Password</label>
        <input
          type="password"
          value={form.state.values.password}
          onChange={(e) => form.setFieldValue('password', e.target.value)}
        />
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          value={form.state.values.confirmPassword}
          onChange={(e) => form.setFieldValue('confirmPassword', e.target.value)}
        />
        {form.state.fieldMeta('confirmPassword')?.errors?.[0] && (
          <span className="text-red-500">
            {form.state.fieldMeta('confirmPassword').errors[0]}
          </span>
        )}
      </div>

      {/* Terms checkbox */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={form.state.values.agreeToTerms}
            onChange={(e) =>
              form.setFieldValue('agreeToTerms', e.target.checked)
            }
          />
          I agree to terms and conditions
        </label>
        {form.state.fieldMeta('agreeToTerms')?.errors?.[0] && (
          <span className="text-red-500">
            {form.state.fieldMeta('agreeToTerms').errors[0]}
          </span>
        )}
      </div>

      <button type="submit" disabled={!form.state.isValid}>
        Register
      </button>
    </form>
  )
}
```

## MSW Integration

Form submission endpoints are mocked with MSW:

### Login Endpoint

```
POST /api/auth/login
Request: { email: string, password: string }
Response: { success: true, user: User } | { success: false, error: string }
```

### Registration Endpoint

```
POST /api/auth/register
Request: Registration form data
Response: { success: true, user: User } | { success: false, errors: Record<string, string> }
```

See `src/mocks/handlers.ts` for implementation.

## Best Practices

1. **Use Zod schemas** - Define validation once, reuse everywhere
2. **Validate on blur** - Don't show errors until user finishes editing
3. **Show user-friendly messages** - "Email already in use" not "Validation failed"
4. **Use async validation sparingly** - Debounce for better UX
5. **Handle loading states** - Disable submit during async operations
6. **Group related fields** - Use `z.object` for logical sections
7. **Cross-field validation** - Use `.refine()` for password confirmation etc
8. **Type inference** - Use `z.infer<typeof schema>` for form data types

## File Structure

```
src/hooks/forms/
├── useForm.ts                   # Generic form hook
├── useLoginForm.ts              # Pre-configured login
├── useFilterForm.ts             # Filter forms
├── useCrudForm.ts               # Create/update forms
├── useFormSubmit.ts             # Submission state (React Hook Form)
├── useFormField.ts              # Field helper (React Hook Form)
├── useValidation.ts             # Validation rules (React Hook Form)
├── ExampleForm.tsx              # Example (React Hook Form)
├── examples/
│   ├── LoginFormExample.tsx     # TanStack login example
│   ├── RegistrationFormExample.tsx  # TanStack registration example
│   ├── FilterFormExample.tsx    # TanStack filter example
│   └── CrudFormExample.tsx      # TanStack CRUD example
└── index.ts                     # Exports
```

## Summary

This infrastructure provides:

✓ Type-safe form handling with Zod
✓ Field and form-level validation
✓ Async validation support
✓ Error state management
✓ MSW mock endpoints
✓ Simple and complex form patterns
✓ Documentation and examples

Use these hooks to build consistent, maintainable forms across your application.
