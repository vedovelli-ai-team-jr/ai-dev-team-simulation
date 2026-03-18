import { http, HttpResponse } from 'msw'
import type { UserProfileResponse } from '../../types/forms/user'

/**
 * Generate default user profile
 */
function generateDefaultProfile(): UserProfileResponse {
  return {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer and team lead',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'developer',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Track whether to simulate conflict (409) response
 * For testing error handling
 */
let shouldSimulateConflict = false

/**
 * In-memory store for user profile
 * In production, this would be persisted in a database
 */
let profileStore = generateDefaultProfile()

export const userProfileHandlers = [
  /**
   * GET /api/user/profile
   * Fetch current user's profile
   */
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      data: profileStore,
      success: true,
    })
  }),

  /**
   * PATCH /api/user/profile
   * Update user's profile
   *
   * Features:
   * - Merge updates with existing profile
   * - Simulate 200ms network delay
   * - Optionally simulate 409 Conflict error for testing
   * - Return updated profile
   */
  http.patch('/api/user/profile', async ({ request }) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Simulate conflict error for testing
    if (shouldSimulateConflict) {
      shouldSimulateConflict = false
      return HttpResponse.json(
        {
          success: false,
          error: 'Conflict: Profile was modified by another user. Please refresh and try again.',
          code: 'PROFILE_CONFLICT',
        },
        { status: 409 }
      )
    }

    const payload = (await request.json()) as Partial<UserProfileResponse>

    // Merge updates with existing profile
    const updated: UserProfileResponse = {
      ...profileStore,
      name: payload.name ?? profileStore.name,
      email: payload.email ?? profileStore.email,
      bio: payload.bio ?? profileStore.bio,
      avatarUrl: payload.avatarUrl ?? profileStore.avatarUrl,
      role: payload.role ?? profileStore.role,
      updatedAt: new Date().toISOString(),
    }

    // Ensure id doesn't change
    updated.id = profileStore.id

    // Update store
    profileStore = updated

    return HttpResponse.json({
      data: updated,
      success: true,
    })
  }),

  /**
   * POST /api/user/profile/reset
   * Reset profile to defaults
   */
  http.post('/api/user/profile/reset', () => {
    profileStore = generateDefaultProfile()

    return HttpResponse.json({
      data: profileStore,
      success: true,
    })
  }),

  /**
   * POST /api/test/conflict-next
   * Helper endpoint for testing - make next profile update fail with 409
   * This is useful for testing the conflict error state
   */
  http.post('/api/test/conflict-next', () => {
    shouldSimulateConflict = true
    return HttpResponse.json({ success: true })
  }),
]
