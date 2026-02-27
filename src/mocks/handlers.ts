import { http, HttpResponse } from 'msw'
import { agentHandlers } from './handlers/agents'
import { taskHandlers } from './handlers/tasks'
import { sprintHandlers } from './handlers/sprints'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...agentHandlers,
  ...taskHandlers,
  ...sprintHandlers,
]
