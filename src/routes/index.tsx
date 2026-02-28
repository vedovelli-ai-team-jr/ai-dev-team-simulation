/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { TeamMembersTable } from '../components/TeamMembersTable'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Dev Team Simulation
          </h1>
          <p className="text-lg text-gray-600">
            Manage and monitor your team members performance
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Team Members
            </h2>
          </div>
          <div className="p-6">
            <TeamMembersTable />
          </div>
        </div>
      </div>
    </main>
  )
}
