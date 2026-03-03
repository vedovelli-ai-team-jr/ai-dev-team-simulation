import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useUserForm } from '@/hooks/forms/useUserForm'
import { TextInput } from '@/components/Form/TextInput'
import { Select } from '@/components/Form/Select'
import type { CreateUserInput } from '@/types/forms/user'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'viewer', label: 'Viewer' },
]

async function createUser(data: CreateUserInput) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create user')
  }

  return response.json()
}

export function CreateUserForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setSuccessMessage('User created successfully!')
      setErrorMessage(null)
      form.reset()
    },
    onError: (error: Error) => {
      setErrorMessage(error.message)
      setSuccessMessage(null)
    },
  })

  const form = useUserForm({
    onSubmit: async (data) => {
      mutation.mutate(data)
    },
  })

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Create User</h1>

      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="name"
          children={(field) => (
            <TextInput
              field={field}
              label="Name"
              placeholder="Enter user name"
            />
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <TextInput
              field={field}
              label="Email"
              type="email"
              placeholder="Enter email address"
            />
          )}
        />

        <form.Field
          name="role"
          children={(field) => (
            <Select
              field={field}
              label="Role"
              options={ROLE_OPTIONS}
              placeholder="Select a role"
            />
          )}
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  )
}
