/**
 * Agent Scheduling Types
 *
 * Defines types for managing agent availability windows (recurring weekly patterns)
 * and blackout periods (non-recurring unavailability blocks).
 */

/**
 * Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Availability window - recurring weekly pattern
 */
export interface AvailabilityWindow {
  /** Day of week (0=Sunday, 1=Monday, ..., 6=Saturday) */
  dayOfWeek: DayOfWeek
  /** Start hour in 24-hour format (0-23) */
  startHour: number
  /** End hour in 24-hour format (0-23) */
  endHour: number
}

/**
 * Blackout period - dates when agent is unavailable
 */
export interface BlackoutPeriod {
  /** ISO date string (YYYY-MM-DD) */
  startDate: string
  /** ISO date string (YYYY-MM-DD) */
  endDate: string
  /** Reason for unavailability (e.g., "PTO", "Conference", "Maintenance") */
  reason: string
}

/**
 * Complete agent scheduling data
 */
export interface AgentScheduling {
  agentId: string
  availabilityWindows: AvailabilityWindow[]
  blackoutPeriods: BlackoutPeriod[]
  currentCapacity: {
    tasksAssigned: number
    maxCapacity: number
  }
}

/**
 * Response from GET /api/agents/:id/scheduling
 */
export interface AgentSchedulingResponse extends AgentScheduling {}

/**
 * Request body for updating availability windows
 */
export interface UpdateAvailabilityWindowsRequest {
  availabilityWindows: AvailabilityWindow[]
}

/**
 * Request body for adding/removing blackout periods
 */
export interface ManageBlackoutRequest {
  blackoutPeriod: BlackoutPeriod
}

/**
 * Request body for deleting blackout periods
 */
export interface DeleteBlackoutRequest {
  startDate: string
  endDate: string
}
