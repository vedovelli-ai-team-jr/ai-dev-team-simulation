/**
 * MSW Handlers for Global Search
 *
 * Provides mock API endpoint for global search across tasks, sprints, and agents:
 * - GET /api/search with query parameter `q`, type filter, and pagination
 * - Returns results grouped by type (tasks, sprints, agents)
 * - Includes matchedField metadata for highlighting
 * - Supports pagination
 */

import { http, HttpResponse } from 'msw'
import type { Task } from '../../types/task'
import type { Sprint } from '../../types/sprint'
import type { Agent } from '../../types/agent'
import type {
  GlobalSearchResult,
  GlobalSearchTaskResult,
  GlobalSearchSprintResult,
  GlobalSearchAgentResult,
  GlobalSearchGroupedResults,
  GlobalSearchResponse,
} from '../../types/search'

/**
 * Mock task data for searching
 */
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Implement authentication system',
    assignee: 'agent-1',
    team: 'backend',
    status: 'in-progress',
    priority: 'high',
    storyPoints: 8,
    sprint: 'sprint-1',
    order: 1,
    estimatedHours: 16,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
  {
    id: 'task-2',
    title: 'Design database schema',
    assignee: 'agent-2',
    team: 'backend',
    status: 'backlog',
    priority: 'high',
    storyPoints: 13,
    sprint: 'sprint-2',
    order: 2,
    estimatedHours: 24,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
  {
    id: 'task-3',
    title: 'API documentation',
    assignee: 'agent-1',
    team: 'platform',
    status: 'done',
    priority: 'medium',
    storyPoints: 5,
    sprint: 'sprint-1',
    order: 3,
    estimatedHours: 8,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
  {
    id: 'task-4',
    title: 'Fix authentication bug',
    assignee: 'agent-3',
    team: 'frontend',
    status: 'in-review',
    priority: 'high',
    storyPoints: 3,
    sprint: 'sprint-1',
    order: 4,
    estimatedHours: 4,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
  {
    id: 'task-5',
    title: 'Setup deployment pipeline',
    assignee: 'agent-4',
    team: 'devops',
    status: 'in-progress',
    priority: 'medium',
    storyPoints: 8,
    sprint: 'sprint-2',
    order: 5,
    estimatedHours: 12,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
]

/**
 * Mock sprint data for searching
 */
const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1: Core Features',
    status: 'active',
    goals: 'Implement core authentication and API endpoints',
    tasks: ['task-1', 'task-3', 'task-4'],
    estimatedPoints: 16,
    taskCount: 3,
    completedCount: 1,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2: Infrastructure',
    status: 'planning',
    goals: 'Setup deployment infrastructure and CI/CD pipeline',
    tasks: ['task-2', 'task-5'],
    estimatedPoints: 21,
    taskCount: 2,
    completedCount: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1,
  },
]

/**
 * Mock agent data for searching
 */
const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Alice',
    role: 'sr-dev',
    status: 'working',
    currentTask: 'task-1',
    output: '',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'agent-2',
    name: 'Bob',
    role: 'sr-dev',
    status: 'idle',
    currentTask: '',
    output: '',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'agent-3',
    name: 'Charlie',
    role: 'junior',
    status: 'working',
    currentTask: 'task-4',
    output: '',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'agent-4',
    name: 'Diana',
    role: 'junior',
    status: 'working',
    currentTask: 'task-5',
    output: '',
    lastUpdated: new Date().toISOString(),
  },
]

/**
 * Highlight matching text in a string
 */
function findMatchedField(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

/**
 * Search tasks for matching query
 */
function searchTasks(query: string): GlobalSearchTaskResult[] {
  return mockTasks
    .filter(
      (task) =>
        findMatchedField(task.title, query) ||
        (task.estimatedHours ? String(task.estimatedHours).includes(query) : false)
    )
    .map((task) => ({
      type: 'task' as const,
      id: task.id,
      title: task.title,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      sprint: task.sprint,
      matchedField: findMatchedField(task.title, query) ? 'title' : 'description',
    }))
}

/**
 * Search sprints for matching query
 */
function searchSprints(query: string): GlobalSearchSprintResult[] {
  return mockSprints
    .filter(
      (sprint) =>
        findMatchedField(sprint.name, query) || (sprint.goals ? findMatchedField(sprint.goals, query) : false)
    )
    .map((sprint) => ({
      type: 'sprint' as const,
      id: sprint.id,
      name: sprint.name,
      status: sprint.status,
      taskCount: sprint.taskCount,
      completedCount: sprint.completedCount,
      matchedField: findMatchedField(sprint.name, query) ? 'name' : 'goals',
    }))
}

/**
 * Search agents for matching query
 */
function searchAgents(query: string): GlobalSearchAgentResult[] {
  return mockAgents
    .filter((agent) => findMatchedField(agent.name, query) || findMatchedField(agent.role, query))
    .map((agent) => ({
      type: 'agent' as const,
      id: agent.id,
      name: agent.name,
      role: agent.role,
      status: agent.status,
      currentTask: agent.currentTask,
      matchedField: findMatchedField(agent.name, query) ? 'name' : 'role',
    }))
}

/**
 * Filter results by type
 */
function filterByType(
  results: GlobalSearchResult[],
  type: string
): GlobalSearchResult[] {
  if (type === 'all') return results
  return results.filter((r) => r.type === type)
}

/**
 * MSW handler for GET /api/search
 */
export const globalSearchHandlers = [
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''
    const typeFilter = url.searchParams.get('type') || 'all'
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10)

    // If no query, return empty results
    if (!query.trim()) {
      const response: GlobalSearchResponse = {
        results: [],
        grouped: { tasks: [], sprints: [], agents: [] },
        total: 0,
        page: 1,
        pageSize,
      }
      return HttpResponse.json(response, { status: 200 })
    }

    // Search across all types
    const taskResults = searchTasks(query)
    const sprintResults = searchSprints(query)
    const agentResults = searchAgents(query)

    // Combine and filter by type
    let allResults: GlobalSearchResult[] = [...taskResults, ...sprintResults, ...agentResults]
    allResults = filterByType(allResults, typeFilter)

    // Paginate
    const total = allResults.length
    const startIdx = (page - 1) * pageSize
    const endIdx = Math.min(startIdx + pageSize, total)
    const paginatedResults = allResults.slice(startIdx, endIdx)

    // Build grouped results
    const grouped: GlobalSearchGroupedResults = {
      tasks: paginatedResults.filter((r) => r.type === 'task') as GlobalSearchTaskResult[],
      sprints: paginatedResults.filter((r) => r.type === 'sprint') as GlobalSearchSprintResult[],
      agents: paginatedResults.filter((r) => r.type === 'agent') as GlobalSearchAgentResult[],
    }

    const response: GlobalSearchResponse = {
      results: paginatedResults,
      grouped,
      total,
      page,
      pageSize,
    }

    return HttpResponse.json(response, { status: 200 })
  }),
]
