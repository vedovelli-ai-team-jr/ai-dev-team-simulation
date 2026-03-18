# Error Boundary & Loading States Implementation Guide

## Overview

This guide covers the error handling UI components that work with the `ErrorProvider` context and `useQueryError` hook to provide consistent error and loading states across the application.

## Components

### ErrorBoundary

Enhanced class component that catches runtime errors and displays fallback UI.

**Features:**
- Catches unhandled runtime errors in component tree
- Accepts custom `fallback` render prop
- Default UI with retry button, reload, and error details
- Semantic HTML with ARIA role="alert" for accessibility
- Error details collapsible for debugging

**Basic Usage:**

```tsx
import { ErrorBoundary } from '@/components'

// With default error UI
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={(error, retry) => (
    <div>
      <p>Custom error: {error.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### ErrorFallback

Functional component for rendering error state with action buttons and toast notifications.

**Features:**
- Displays error with customizable title and message
- Three action buttons: Try Again, Reload Page, Go Back
- Collapsible error details for developers
- Toast notifications on retry/reload
- Full accessibility: ARIA live region, semantic buttons
- Integrates with `useToast` hook

**Props:**

```tsx
interface ErrorFallbackProps {
  error: Error | null
  isRetrying?: boolean
  onRetry: () => void
  title?: string
  message?: string
  showDetails?: boolean
}
```

**Usage with useQueryError:**

```tsx
import { useQueryError } from '@/hooks'
import { ErrorFallback } from '@/components'

function MyComponent() {
  const { error, isRetrying, retry } = useQueryError({
    context: 'notifications',
  })

  if (error) {
    return (
      <ErrorFallback
        error={error}
        isRetrying={isRetrying}
        onRetry={retry}
        title="Failed to load notifications"
      />
    )
  }

  return <div>Content</div>
}
```

### LoadingFallback

Functional component for displaying animated skeleton loading states.

**Features:**
- Multiple variants: `table`, `card`, `list`
- Customizable row count
- Staggered animation for visual appeal
- ARIA live region for screen readers
- Semantic HTML with proper roles

**Variants:**

- **table**: Skeleton rows with columns for table-like data
- **card**: Grid of skeleton cards for dashboard layouts
- **list**: Stacked skeleton items for list views

**Usage:**

```tsx
import { LoadingFallback } from '@/components'
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  if (isLoading) {
    return <LoadingFallback variant="list" rowCount={5} />
  }

  if (error) {
    return <ErrorFallback error={error} onRetry={() => {}} />
  }

  return <div>{data?.map(/* ... */)</div>
}
```

## Integration Pattern

### With TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { useQueryError } from '@/hooks'
import { ErrorFallback, LoadingFallback } from '@/components'

function NotificationsPanel() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  const queryError = useQueryError({
    context: 'notifications',
    errorMessage: 'Failed to load notifications',
  })

  // Handle query errors
  React.useEffect(() => {
    if (error) {
      queryError.handleError(error as Error, () => refetch())
    }
  }, [error, queryError, refetch])

  if (isLoading) {
    return <LoadingFallback variant="list" rowCount={5} />
  }

  if (queryError.error) {
    return (
      <ErrorFallback
        error={queryError.error}
        isRetrying={queryError.isRetrying}
        onRetry={queryError.retry}
      />
    )
  }

  return (
    <div>
      {data?.map((notification) => (
        <div key={notification.id}>{notification.message}</div>
      ))}
    </div>
  )
}
```

### With ErrorBoundary

```tsx
import { ErrorBoundary, ErrorFallback } from '@/components'

function Page() {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <ErrorFallback
          error={error}
          onRetry={retry}
          title="Page Error"
          message="An unexpected error occurred on this page."
        />
      )}
    >
      <Dashboard />
    </ErrorBoundary>
  )
}
```

### Full Data Fetching Pattern

```tsx
import { useQuery } from '@tanstack/react-query'
import { useQueryError } from '@/hooks'
import { ErrorBoundary, ErrorFallback, LoadingFallback } from '@/components'

function TaskList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })

  const queryError = useQueryError({
    context: 'tasks',
    errorMessage: 'Failed to load tasks',
    showRetryNotification: true,
  })

  const handleError = async () => {
    await queryError.handleError(error as Error, () => refetch())
  }

  React.useEffect(() => {
    if (error) {
      handleError()
    }
  }, [error])

  return (
    <ErrorBoundary
      fallback={(err, retry) => (
        <ErrorFallback
          error={err}
          onRetry={retry}
          title="Task List Error"
        />
      )}
    >
      {isLoading && <LoadingFallback variant="table" rowCount={5} />}
      {queryError.error && (
        <ErrorFallback
          error={queryError.error}
          isRetrying={queryError.isRetrying}
          onRetry={queryError.retry}
        />
      )}
      {!isLoading && !queryError.error && (
        <table>
          <tbody>
            {data?.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ErrorBoundary>
  )
}
```

## Accessibility

All components follow WCAG 2.1 AA standards:

1. **ErrorFallback & ErrorBoundary:**
   - `role="alert"` for error announcements
   - `aria-live="assertive"` for immediate screen reader notification
   - Screen reader text in `sr-only` div explaining actions
   - Semantic buttons with descriptive `aria-label`

2. **LoadingFallback:**
   - `role="status"` for status announcements
   - `aria-live="polite"` for non-urgent updates
   - Screen reader message in `sr-only` div

3. **Color & Contrast:**
   - Error states: Red/orange (#EF4444, #F97316) with dark backgrounds
   - Success states: Green (#10B981) with dark backgrounds
   - All colors meet WCAG AA contrast ratios

## Best Practices

1. **Provide context-specific error messages:**
   ```tsx
   <ErrorFallback
     title="Failed to load notifications"
     message="Please check your connection and try again."
   />
   ```

2. **Use appropriate variant for data shape:**
   ```tsx
   // Table data
   <LoadingFallback variant="table" />

   // Card grid data
   <LoadingFallback variant="card" />

   // List data
   <LoadingFallback variant="list" />
   ```

3. **Always provide retry callbacks:**
   ```tsx
   const { refetch } = useQuery({/* ... */})
   const { error, retry } = useQueryError({/* ... */})

   // Connect refetch to retry
   React.useEffect(() => {
     if (error) {
       queryError.handleError(error as Error, () => refetch())
     }
   }, [error])
   ```

4. **Wrap specific regions, not entire app:**
   ```tsx
   // Good: Isolated error boundary
   <div>
     <Header />
     <ErrorBoundary>
       <Dashboard />
     </ErrorBoundary>
     <Footer />
   </div>

   // Avoid: App-level boundary hides all errors
   <ErrorBoundary>
     <App />
   </ErrorBoundary>
   ```

5. **Show loading state before error:**
   ```tsx
   if (isLoading) return <LoadingFallback />
   if (error) return <ErrorFallback />
   return <Content />
   ```

## Testing

### Example Tests

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorFallback } from '@/components'
import { ToastProvider } from '@/contexts/ToastContext'

describe('ErrorFallback', () => {
  const renderWithToast = (component: React.ReactNode) =>
    render(<ToastProvider>{component}</ToastProvider>)

  it('renders error with title and message', () => {
    const error = new Error('Test error')
    renderWithToast(
      <ErrorFallback
        error={error}
        onRetry={() => {}}
        title="Failed to load"
      />
    )

    expect(screen.getByText('Failed to load')).toBeInTheDocument()
  })

  it('calls onRetry when retry button clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const error = new Error('Test error')

    renderWithToast(
      <ErrorFallback error={error} onRetry={onRetry} />
    )

    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('announces error to screen readers', () => {
    const error = new Error('Test error')
    renderWithToast(
      <ErrorFallback error={error} onRetry={() => {}} />
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })
})
```

## Storybook

View all component variants in Storybook:

```bash
npm run storybook
```

Navigate to: **Components > Error & Loading States**

All stories demonstrate:
- Different error states
- Loading variants
- Accessibility features
- Integration patterns
