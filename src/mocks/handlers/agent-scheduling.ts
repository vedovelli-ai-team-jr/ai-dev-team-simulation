/**
 * MSW Handlers for Agent Scheduling
 *
 * Mock API endpoints for agent availability windows and blackout periods:
 * - GET /api/agents/:id/scheduling — Get agent scheduling data
 * - PATCH /api/agents/:id/scheduling/availability-windows — Update availability windows
 * - POST /api/agents/:id/scheduling/blackouts — Add blackout period
 * - DELETE /api/agents/:id/scheduling/blackouts — Remove blackout period
 */

import { http, HttpResponse } from 'msw'
import type {
  AgentScheduling,
  AvailabilityWindow,
  BlackoutPeriod,
} from '../../types/agent-scheduling'

/**
 * Mock data for agent scheduling
 */
const agentSchedulingData: Record<string, AgentScheduling> = {
  'agent-sr-dev': {
    agentId: 'agent-sr-dev',
    availabilityWindows: [
      // Monday through Friday, 9am-5pm
      { dayOfWeek: 1, startHour: 9, endHour: 17 },
      { dayOfWeek: 2, startHour: 9, endHour: 17 },
      { dayOfWeek: 3, startHour: 9, endHour: 17 },
      { dayOfWeek: 4, startHour: 9, endHour: 17 },
      { dayOfWeek: 5, startHour: 9, endHour: 17 },
    ],
    blackoutPeriods: [
      {
        startDate: '2026-03-20',
        endDate: '2026-03-22',
        reason: 'Conference attendance',
      },
    ],
    currentCapacity: {
      tasksAssigned: 3,
      maxCapacity: 5,
    },
  },
  'agent-junior': {
    agentId: 'agent-junior',
    availabilityWindows: [
      // Monday through Friday, 8am-6pm (flexible)
      { dayOfWeek: 1, startHour: 8, endHour: 18 },
      { dayOfWeek: 2, startHour: 8, endHour: 18 },
      { dayOfWeek: 3, startHour: 8, endHour: 18 },
      { dayOfWeek: 4, startHour: 8, endHour: 18 },
      { dayOfWeek: 5, startHour: 8, endHour: 18 },
    ],
    blackoutPeriods: [],
    currentCapacity: {
      tasksAssigned: 5,
      maxCapacity: 8,
    },
  },
  'agent-pm': {
    agentId: 'agent-pm',
    availabilityWindows: [
      // Monday through Friday, 9am-5pm
      { dayOfWeek: 1, startHour: 9, endHour: 17 },
      { dayOfWeek: 2, startHour: 9, endHour: 17 },
      { dayOfWeek: 3, startHour: 9, endHour: 17 },
      { dayOfWeek: 4, startHour: 9, endHour: 17 },
      { dayOfWeek: 5, startHour: 9, endHour: 17 },
      // Saturday office hours
      { dayOfWeek: 6, startHour: 10, endHour: 14 },
    ],
    blackoutPeriods: [
      {
        startDate: '2026-03-25',
        endDate: '2026-03-27',
        reason: 'PTO - Personal time off',
      },
    ],
    currentCapacity: {
      tasksAssigned: 2,
      maxCapacity: 4,
    },
  },
}

/**
 * GET /api/agents/:id/scheduling
 * Return agent scheduling data
 */
export const getAgentScheduling = http.get('/api/agents/:id/scheduling', ({ params }) => {
  const { id } = params as { id: string }

  const scheduling =
    agentSchedulingData[id] ||
    agentSchedulingData['agent-junior'] // Default fallback
  if (!scheduling) {
    return HttpResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // 200ms delay to simulate network
  return HttpResponse.json(scheduling, { delay: 200 })
})

/**
 * PATCH /api/agents/:id/scheduling/availability-windows
 * Update agent availability windows
 */
export const updateAvailabilityWindows = http.patch(
  '/api/agents/:id/scheduling/availability-windows',
  async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { availabilityWindows: AvailabilityWindow[] }

    const scheduling = agentSchedulingData[id]
    if (!scheduling) {
      return HttpResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    scheduling.availabilityWindows = body.availabilityWindows

    return HttpResponse.json(scheduling, { delay: 200 })
  }
)

/**
 * POST /api/agents/:id/scheduling/blackouts
 * Add a blackout period
 */
export const addBlackoutPeriod = http.post(
  '/api/agents/:id/scheduling/blackouts',
  async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { blackoutPeriod: BlackoutPeriod }

    const scheduling = agentSchedulingData[id]
    if (!scheduling) {
      return HttpResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    scheduling.blackoutPeriods.push(body.blackoutPeriod)
    // Sort blackout periods by startDate
    scheduling.blackoutPeriods.sort((a, b) => a.startDate.localeCompare(b.startDate))

    return HttpResponse.json(scheduling, { delay: 200 })
  }
)

/**
 * DELETE /api/agents/:id/scheduling/blackouts
 * Remove a blackout period by date range
 */
export const deleteBlackoutPeriod = http.delete(
  '/api/agents/:id/scheduling/blackouts',
  async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = (await request.json()) as { startDate: string; endDate: string }

    const scheduling = agentSchedulingData[id]
    if (!scheduling) {
      return HttpResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    scheduling.blackoutPeriods = scheduling.blackoutPeriods.filter(
      (bp) => !(bp.startDate === body.startDate && bp.endDate === body.endDate)
    )

    return HttpResponse.json(scheduling, { delay: 200 })
  }
)

export const agentSchedulingHandlers = [
  getAgentScheduling,
  updateAvailabilityWindows,
  addBlackoutPeriod,
  deleteBlackoutPeriod,
]
