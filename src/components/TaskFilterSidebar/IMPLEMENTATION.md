# TaskFilterSidebar Implementation Guide

## Overview

The `TaskFilterSidebar` component provides a collapsible sidebar for filtering tasks by Agent (assignee), Priority, and Status. It integrates seamlessly with the `useTaskFilters` hook to manage filter state and update the URL search params.

## Component API

### Props

```typescript
interface TaskFilterSidebarProps {
  filters: {
    status?: TaskStatus[]
    priority?: TaskPriority[]
    assignee?: string[]
  }
  onFilterChange: (filterKey: 'status' | 'priority' | 'assignee', value: TaskStatus[] | TaskPriority[] | string[]) => void
  onClearFilters: () => void
  activeFilterCount: number
}
```

## Usage Example

```tsx
import { TaskFilterSidebar } from '@/components/TaskFilterSidebar'
import { useTaskFilters } from '@/hooks/useTaskFilters'
import { useMemo } from 'react'

function TaskListView() {
  const { status, priority, assignee, setFilter, clearAllFilters } = useTaskFilters()
  const { data: tasks = [] } = useTasks()

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (status?.length) count += status.length
    if (priority?.length) count += priority.length
    if (assignee?.length) count += assignee.length
    return count
  }, [status, priority, assignee])

  // Filter tasks based on applied filters
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    if (status?.length) {
      filtered = filtered.filter(t => status.includes(t.status))
    }
    if (priority?.length) {
      filtered = filtered.filter(t => priority.includes(t.priority))
    }
    if (assignee?.length) {
      filtered = filtered.filter(t => assignee.includes(t.assignee))
    }

    return filtered
  }, [tasks, status, priority, assignee])

  return (
    <div className="flex gap-4">
      <TaskFilterSidebar
        filters={{ status, priority, assignee }}
        onFilterChange={(key, value) => setFilter(key, value)}
        onClearFilters={clearAllFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="flex-1">
        {filteredTasks.length === 0 ? (
          <p>No tasks match your filters</p>
        ) : (
          <TaskTable tasks={filteredTasks} />
        )}
      </div>
    </div>
  )
}
```

## Features

### 1. Collapsible Sidebar
- Toggle button to collapse/expand the sidebar
- Saves screen space when filters are not needed
- Arrow indicator (← / →) shows collapse state

### 2. Agent Filter
- Dropdown select populated from `useAgents()` hook
- Single selection (replaces previous selection)
- Shows all available agents with their names

### 3. Priority Filter
- Multi-select checkboxes: Low / Medium / High
- Can select multiple priorities simultaneously
- Filters applied with OR logic within priority dimension

### 4. Status Filter
- Multi-select checkboxes: Backlog / In Progress / In Review / Done
- Can select multiple statuses simultaneously
- Filters applied with OR logic within status dimension

### 5. Active Filter Count Badge
- Shows number of active filters (when > 0)
- Displays in blue badge with count
- Quick visual indicator of filtering activity

### 6. Clear All Button
- Appears only when filters are active
- Resets all filters in one click
- Calls `onClearFilters()` which clears URL params

## Accessibility

The component includes comprehensive accessibility features:

- **Semantic Labels**: All form controls have proper `<label>` elements
- **ARIA Labels**: Button and sidebar have descriptive `aria-label` attributes
- **Keyboard Navigation**: All controls are keyboard accessible
- **Checkbox State**: Proper `checked` state management
- **Focus Management**: Native browser focus handling

## Styling

Uses Tailwind CSS with a dark theme consistent with the app:

- **Colors**: Slate background (`bg-slate-900`), borders (`border-slate-700`)
- **Hover States**: Interactive feedback on buttons and controls
- **Responsive**: Adapts to collapsing state
- **Spacing**: Consistent padding and gap utilities

## Integration with useTaskFilters

The sidebar integrates with the `useTaskFilters` hook which:

1. **Parses URL search params** to extract current filter state
2. **Provides setFilter()** to update individual filters
3. **Provides clearAllFilters()** to reset all filters
4. **Manages debounced URL updates** automatically
5. **Triggers cache invalidation** on filter changes

Filter values are arrays to support multi-select UI patterns, matching the hook's data structure.

## Filter Logic

Filters are combined using AND logic across dimensions:
- `(status.includes(low) OR status.includes(medium)) AND (priority includes A OR B) AND (assignee === X)`

## Notes

- Agent filter uses single selection (dropdown) unlike Priority/Status which use multi-select
- Empty filters default to showing all items in that dimension
- Active filter count reflects total selected items across all dimensions
- Sidebar collapse state is local to component instance (not persisted)
