import { http, HttpResponse } from 'msw'
import type { Agent } from '../../types/domain'

const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Alex',
    role: 'architect',
    status: 'thinking',
    currentTaskId: 'task-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-2',
    name: 'Bailey',
    role: 'engineer',
    status: 'idle',
    currentTaskId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-3',
    name: 'Casey',
    role: 'tester',
    status: 'idle',
    currentTaskId: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-4',
    name: 'Dakota',
    role: 'researcher',
    status: 'thinking',
    currentTaskId: 'task-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'agent-5',
    name: 'Evan',
    role: 'engineer',
    status: 'error',
    currentTaskId: null,
    createdAt: new Date().toISOString(),
  },
]

export const agentHandlers = [
  http.get('/api/agents', () => {
    return HttpResponse.json(mockAgents)
  }),

  http.get('/api/agents/:id', ({ params }) => {
    const agent = mockAgents.find((a) => a.id === params.id)
    if (!agent) {
      return HttpResponse.json({ error: 'Agent not found' }, { status: 404 })
    }
    return HttpResponse.json(agent)
  }),

  http.patch('/api/agents/:id', async ({ params, request }) => {
    const agent = mockAgents.find((a) => a.id === params.id)
    if (!agent) {
      return HttpResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const body = (await request.json()) as Partial<Agent>
    Object.assign(agent, body)
    return HttpResponse.json(agent)
  }),
]
