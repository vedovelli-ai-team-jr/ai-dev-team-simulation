import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConflictBanner } from './ConflictBanner'

describe('ConflictBanner', () => {
  it('should render when hasConflict is true', () => {
    const onViewConflict = vi.fn()

    render(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    expect(screen.getByText(/was updated by someone else/)).toBeInTheDocument()
  })

  it('should not render when hasConflict is false', () => {
    const onViewConflict = vi.fn()

    const { container } = render(
      <ConflictBanner hasConflict={false} onViewConflict={onViewConflict} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should display correct entity type in message', () => {
    const onViewConflict = vi.fn()

    render(
      <ConflictBanner
        hasConflict={true}
        onViewConflict={onViewConflict}
        entityType="sprint"
      />
    )

    expect(screen.getByText(/This sprint was updated/)).toBeInTheDocument()
  })

  it('should call onViewConflict when "View Conflict" button is clicked', async () => {
    const onViewConflict = vi.fn()
    const user = userEvent.setup()

    render(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    const viewButton = screen.getByText('View Conflict')
    await user.click(viewButton)

    expect(onViewConflict).toHaveBeenCalled()
  })

  it('should hide banner when dismiss button is clicked', async () => {
    const onViewConflict = vi.fn()
    const user = userEvent.setup()

    render(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    expect(screen.getByText(/was updated by someone else/)).toBeInTheDocument()

    const dismissButton = screen.getByLabelText('Dismiss conflict banner')
    await user.click(dismissButton)

    expect(screen.queryByText(/was updated by someone else/)).not.toBeInTheDocument()
  })

  it('should reappear when hasConflict changes to true again', async () => {
    const onViewConflict = vi.fn()
    const user = userEvent.setup()

    const { rerender } = render(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    // Dismiss the banner
    const dismissButton = screen.getByLabelText('Dismiss conflict banner')
    await user.click(dismissButton)

    expect(screen.queryByText(/was updated by someone else/)).not.toBeInTheDocument()

    // New conflict detected (hasConflict changes to false then true)
    rerender(
      <ConflictBanner hasConflict={false} onViewConflict={onViewConflict} />
    )
    rerender(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    expect(screen.getByText(/was updated by someone else/)).toBeInTheDocument()
  })

  it('should have proper accessibility features', () => {
    const onViewConflict = vi.fn()

    render(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    const dismissButton = screen.getByLabelText('Dismiss conflict banner')
    expect(dismissButton).toHaveAttribute('aria-label')
  })

  it('should show warning icon', () => {
    const onViewConflict = vi.fn()

    render(
      <ConflictBanner hasConflict={true} onViewConflict={onViewConflict} />
    )

    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })
})
