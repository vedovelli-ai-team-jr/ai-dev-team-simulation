// Agent types
export interface Agent {
  id: string
  name: string
  role: 'researcher' | 'architect' | 'engineer' | 'tester'
  status: 'thinking' | 'idle' | 'error'
  currentTaskId: string | null
  createdAt: string
}

// Task types
export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  assignedAgentId: string | null
  sprintId: string
  createdAt: string
  updatedAt: string
}

// Sprint types
export interface Sprint {
  id: string
  name: string
  status: 'planning' | 'active' | 'completed'
  startDate: string
  endDate: string
  createdAt: string
}

// Task state for real-time updates
export interface TaskState {
  taskId: string
  agentId: string
  state: 'thinking' | 'executing' | 'completed' | 'error'
  progress: number // 0-100
  message?: string
  updatedAt: string
}
