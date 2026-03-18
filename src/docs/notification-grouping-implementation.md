# Notification Grouping Implementation Guide

## Overview

This guide explains the notification grouping feature that collapses consecutive notifications from the same source into expandable groups. This reduces notification fatigue and improves the user experience by organizing notifications logically.

## Features

- **Automatic Grouping**: Consecutive notifications from the same source (agent, sprint, task) are automatically collapsed into a single group
- **Expand/Collapse**: Users can expand groups to see individual notifications
- **Smart Defaults**: Single-item groups are always expanded; multi-item groups are collapsed by default
- **Batch Mark-as-Read**: Mark all notifications in a group as read with a single action
- **Type-Safe**: Full TypeScript support with proper typing throughout
- **Zero Additional API Calls**: Pure data transformation—no separate API calls needed

## Architecture

### 1. **groupNotifications Utility** (`src/utils/groupNotifications.ts`)

Pure function that transforms a flat array of notifications into groups:

```typescript
import { groupNotifications } from '@/utils'

const flat = [notif1, notif2, notif3]
const groups = groupNotifications(flat)
// Output: NotificationGroup[]
```

**Key Functions:**
- `groupNotifications(notifications)` - Main grouping function
- `getGroupNotificationIds(group)` - Extract IDs from a group

**NotificationGroup Interface:**
```typescript
interface NotificationGroup {
  id: string                          // Unique group ID
  sourceId: string                    // agentId, sprintId, taskId, etc.
  sourceName: string                  // Human-readable name (e.g., "Agent Alice")
  sourceType: string                  // Type of source (e.g., "assignment_changed")
  count: number                       // Number of notifications
  isExpanded: boolean                 // Current expand/collapse state
  notifications: Notification[]       // Individual notifications
  timestamp: string                   // Most recent notification timestamp
  hasUnread: boolean                  // Whether group has unread items
}
```

### 2. **useGroupedNotifications Hook** (`src/hooks/useGroupedNotifications.ts`)

Wraps `useNotifications` to provide grouped data with state management:

```typescript
import { useGroupedNotifications } from '@/hooks'

const {
  groups,
  toggleGroupExpanded,
  expandAllGroups,
  collapseAllGroups,
  markGroupAsRead,
  markAllGroupsAsRead,
  unreadCount,
  isLoading,
  dismissNotification,
} = useGroupedNotifications({
  refetchInterval: 30000,      // Optional: polling interval
  refetchOnWindowFocus: true,  // Optional: refetch on focus
})
```

**API:**

| Property | Type | Description |
|----------|------|-------------|
| `groups` | `NotificationGroup[]` | Grouped notifications with expand state |
| `toggleGroupExpanded` | `(groupId: string) => void` | Toggle expand/collapse for a group |
| `expandAllGroups` | `() => void` | Expand all groups |
| `collapseAllGroups` | `() => void` | Collapse all multi-item groups |
| `markGroupAsRead` | `(groupId: string) => Promise<void>` | Mark group's unread as read |
| `markAllGroupsAsRead` | `() => Promise<void>` | Mark all unread across all groups |
| `unreadCount` | `number` | Total unread count |
| `isLoading` | `boolean` | Loading state from underlying hook |
| `error` | `Error \| null` | Error from underlying hook |
| `dismissNotification` | `(id: string) => void` | Dismiss a single notification |

### 3. **NotificationGroupItem Component** (`src/components/NotificationGroup/NotificationGroupItem.tsx`)

Display component for a single group:

```typescript
import { NotificationGroupItem } from '@/components/NotificationGroup'

<NotificationGroupItem
  group={group}
  onToggleExpand={toggleGroupExpanded}
  onMarkGroupAsRead={markGroupAsRead}
  onDismiss={dismissNotification}
  isLoading={isLoading}
/>
```

**Features:**
- Collapsed view shows summary with count badge
- Expanded view shows individual notifications with timestamps
- Mark-as-read button for unread items
- Dismiss button on individual items
- Unread indicator dots
- Accessible with keyboard support

## Grouping Rules

Consecutive notifications are grouped if they share the same:

1. **For assignment_changed events**: Same `relatedId` (agent ID)
2. **For sprint_updated events**: Same `relatedId` (sprint ID)
3. **For task_reassigned events**: Same `relatedId` (task ID)
4. **For deadline_approaching events**: Same `relatedId` (task ID)
5. **For other types**: Same notification type

**Example Groups:**
```
Group 1: Agent Alice — 3 tasks assigned
  ├─ Task "Auth module" assigned to Agent Alice
  ├─ Task "Database pool" assigned to Agent Alice
  └─ Task "Email system" assigned to Agent Alice

Group 2: Sprint 5 — 2 updates
  ├─ Sprint 5 status changed
  └─ Sprint 5 backlog refinement scheduled

Group 3: Task "API refactoring" (single notification, always expanded)
  └─ Task reassigned from Alice to Diana
```

## Usage Example

### Basic Setup in a Component

```typescript
import { useGroupedNotifications } from '@/hooks'
import { NotificationGroupItem } from '@/components/NotificationGroup'

export function NotificationCenter() {
  const {
    groups,
    toggleGroupExpanded,
    markGroupAsRead,
    dismissNotification,
    unreadCount,
    isLoading,
  } = useGroupedNotifications()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="notification-list">
      <div className="notification-header">
        <h2>Notifications ({unreadCount} unread)</h2>
      </div>

      <div className="groups">
        {groups.map((group) => (
          <NotificationGroupItem
            key={group.id}
            group={group}
            onToggleExpand={toggleGroupExpanded}
            onMarkGroupAsRead={markGroupAsRead}
            onDismiss={dismissNotification}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}
```

### Advanced: Custom Grouping Display

```typescript
export function CustomNotificationGrouping() {
  const { groups, toggleGroupExpanded, markGroupAsRead } = useGroupedNotifications()

  return (
    <div className="notifications">
      {groups.map((group) => (
        <div key={group.id} className="group">
          <div className="group-header" onClick={() => toggleGroupExpanded(group.id)}>
            <h3>{group.sourceName}</h3>
            <span className="count">{group.count}</span>
            {group.hasUnread && <span className="badge-unread">New</span>}
          </div>

          {group.isExpanded && (
            <div className="group-items">
              {group.notifications.map((notif) => (
                <div key={notif.id} className="notification-item">
                  <p>{notif.message}</p>
                  {!notif.read && (
                    <button onClick={() => markGroupAsRead(group.id)}>
                      Mark as read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

## Integration with Existing Components

The hook is designed to compose naturally with existing notification components:

### With NotificationCenter

```typescript
// Before: useNotifications
const { notifications, markAsRead, dismissNotification } = useNotifications()

// After: useGroupedNotifications
const { groups, markGroupAsRead, dismissNotification } = useGroupedNotifications()

// groups has same data, just organized differently
```

### With Toast Notifications

Useful for showing group summaries in toasts:

```typescript
function showNotificationToast(group: NotificationGroup) {
  toast.info(`${group.sourceName}: ${group.count} new notifications`)
}
```

## Type Definitions

Full TypeScript support with exported types:

```typescript
import type {
  NotificationGroup,
  UseGroupedNotificationsReturn,
} from '@/hooks'
```

## Testing

The `groupNotifications` utility is pure and easy to test:

```typescript
import { groupNotifications } from '@/utils'

describe('groupNotifications', () => {
  it('groups consecutive notifications by source', () => {
    const notifs = [
      { id: '1', eventType: 'assignment_changed', relatedId: 'agent-1' },
      { id: '2', eventType: 'assignment_changed', relatedId: 'agent-1' },
      { id: '3', eventType: 'assignment_changed', relatedId: 'agent-2' },
    ]
    const groups = groupNotifications(notifs)
    expect(groups).toHaveLength(2)
    expect(groups[0].count).toBe(2)
    expect(groups[1].count).toBe(1)
  })
})
```

## Performance Considerations

- **Grouping**: O(n) time complexity—linear scan with single pass
- **State Updates**: Only re-group when notifications array changes
- **Expand State**: Lightweight state object—no impact on performance
- **Memoization**: Uses `useMemo` to prevent unnecessary regrouping

## Future Enhancements

Possible improvements for future iterations:

1. **Custom Grouping Logic**: Allow custom grouping strategies per notification type
2. **Persistence**: Save expand/collapse preferences to localStorage
3. **Group Actions**: Bulk actions like "Dismiss group" or "Mark all as read"
4. **Time-Based Grouping**: Optional grouping by time range (e.g., "Last hour", "Today")
5. **Notifications Context**: Share grouped state via React Context for cross-component access

## FAQ

**Q: Does this make additional API calls?**
A: No. `useGroupedNotifications` purely transforms the data from `useNotifications`. It reuses the same polling and mutations.

**Q: Can I customize how notifications are grouped?**
A: Currently, grouping is based on source ID and consecutive order. Custom logic can be added by wrapping the hook or modifying `getSourceIdentifier()`.

**Q: What happens to single notifications?**
A: Single notifications appear in groups of size 1 and are always expanded for better visibility.

**Q: How do I mark a group as read?**
A: Call `markGroupAsRead(groupId)`. It intelligently batches the mark-as-read calls using the underlying hook.
