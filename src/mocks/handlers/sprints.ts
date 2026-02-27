import { http, HttpResponse } from 'msw'
import type { Sprint } from '../../types/domain'

const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1: Foundation',
    status: 'active',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
]

export const sprintHandlers = [
  http.get('/api/sprints', () => {
    return HttpResponse.json(mockSprints)
  }),

  http.get('/api/sprints/:id', ({ params }) => {
    const sprint = mockSprints.find((s) => s.id === params.id)
    if (!sprint) {
      return HttpResponse.json({ error: 'Sprint not found' }, { status: 404 })
    }
    return HttpResponse.json(sprint)
  }),
]
