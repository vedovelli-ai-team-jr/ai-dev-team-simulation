import { useTeamMembers } from '../../hooks/useTeamMembers'
import type { TeamMember } from '../../types/team'

function TeamMemberItem({ member }: { member: TeamMember }) {
  return (
    <div className="border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition-colors">
      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
      <p className="text-slate-300 text-sm mt-1">{member.role}</p>
      <p className="text-slate-400 text-sm mt-2">{member.email}</p>
    </div>
  )
}

export function TeamMembersList() {
  const { data, isLoading, error } = useTeamMembers()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading team members...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl text-red-400">
          Failed to load team members. Please try again later.
        </div>
      </div>
    )
  }

  const members = data?.members || []

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Team Members</h1>
        <p className="text-slate-400 mb-8">
          {members.length} {members.length === 1 ? 'member' : 'members'} in the team
        </p>

        {members.length === 0 ? (
          <div className="text-slate-400">No team members found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
