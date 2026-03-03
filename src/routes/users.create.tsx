import { createFileRoute } from '@tanstack/react-router'
import { CreateUserForm } from '@/pages/Users/CreateUserForm'

export const Route = createFileRoute('/users/create')({
  component: CreateUserFormPage,
})

function CreateUserFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <CreateUserForm />
      </div>
    </div>
  )
}
