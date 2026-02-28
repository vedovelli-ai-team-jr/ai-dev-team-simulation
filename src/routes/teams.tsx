/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTeams } from '../hooks/useTeams'

export const Route = createFileRoute('/teams')({
  component: TeamsPage,
})

function TeamsPage() {
  const { data: teams, isLoading, error } = useTeams()
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all'
  )

  const filteredTeams = teams?.filter((team) => {
    if (statusFilter === 'all') return true
    return team.status === statusFilter
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Teams</h1>
        <div className="text-slate-400">Loading...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Teams</h1>
        <div className="text-red-400">Error loading teams</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Teams</h1>

      <div className="max-w-6xl">
        {/* Filtering Sidebar */}
        <div className="mb-8 bg-slate-800 rounded-lg p-6 w-full sm:w-64">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
              }
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-slate-800 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-750">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams && filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{team.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          team.status === 'active'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {team.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{team.members}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-slate-400">
                    No teams found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
