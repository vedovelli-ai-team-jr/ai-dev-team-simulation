import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useCreateTeam, type CreateTeamInput } from '../hooks/useCreateTeam'
import { useToast } from './Toast'

interface FormFields {
  name: string
  description: string
  memberCount: string
}

export const TeamCreateForm = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const { mutate, isPending } = useCreateTeam()

  const form = useForm<FormFields>({
    defaultValues: {
      name: '',
      description: '',
      memberCount: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const data: CreateTeamInput = {
          name: value.name,
          description: value.description,
          memberCount: parseInt(value.memberCount, 10),
        }

        mutate(data, {
          onSuccess: () => {
            showToast('Team created successfully!', 'success')
            router.navigate({ to: '/teams' })
          },
          onError: () => {
            showToast('Failed to create team', 'error')
          },
        })
      } catch (error) {
        showToast('An error occurred', 'error')
      }
    },
  })

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Team</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-6 bg-slate-800 p-8 rounded-lg"
        >
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Team name is required'
                }
                if (value.length < 2) {
                  return 'Team name must be at least 2 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium mb-2"
                >
                  Team Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter team name"
                  disabled={isPending}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Description is required'
                }
                if (value.length < 5) {
                  return 'Description must be at least 5 characters'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter team description"
                  rows={4}
                  disabled={isPending}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="memberCount"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Member count is required'
                }
                const num = parseInt(value, 10)
                if (isNaN(num)) {
                  return 'Member count must be a number'
                }
                if (num < 1) {
                  return 'Member count must be at least 1'
                }
                if (num > 1000) {
                  return 'Member count cannot exceed 1000'
                }
                return undefined
              },
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium mb-2"
                >
                  Number of Members
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter number of members"
                  min="1"
                  max="1000"
                  disabled={isPending}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm mt-1">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              {isPending ? 'Creating...' : 'Create Team'}
            </button>
            <button
              type="button"
              onClick={() => router.navigate({ to: '/' })}
              disabled={isPending}
              className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
