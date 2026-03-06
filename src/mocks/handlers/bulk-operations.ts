import { http, HttpResponse } from 'msw'

interface BulkUpdatePayload {
  agentIds: string[]
  updates: Record<string, unknown>
}

interface BulkAssignPayload {
  agentIds: string[]
  task: {
    id: string
    name: string
  }
}

export const bulkOperationHandlers = [
  http.post('/api/agents/bulk-update', async ({ request }) => {
    const payload = (await request.json()) as BulkUpdatePayload

    // Simulate partial failure scenario (20% fail)
    const failureThreshold = Math.random()
    if (failureThreshold < 0.2) {
      return HttpResponse.json(
        {
          error: 'Failed to update some agents',
          failedAgents: payload.agentIds.slice(0, Math.ceil(payload.agentIds.length * 0.3)),
          successCount: payload.agentIds.length - Math.ceil(payload.agentIds.length * 0.3),
        },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      updatedCount: payload.agentIds.length,
      updates: payload.updates,
    })
  }),

  http.post('/api/agents/bulk-assign', async ({ request }) => {
    const payload = (await request.json()) as BulkAssignPayload

    // Simulate partial failure scenario (20% fail)
    const failureThreshold = Math.random()
    if (failureThreshold < 0.2) {
      return HttpResponse.json(
        {
          error: 'Failed to assign task to some agents',
          failedAgents: payload.agentIds.slice(0, Math.ceil(payload.agentIds.length * 0.3)),
          successCount: payload.agentIds.length - Math.ceil(payload.agentIds.length * 0.3),
        },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      success: true,
      assignedCount: payload.agentIds.length,
      task: payload.task,
    })
  }),
]
