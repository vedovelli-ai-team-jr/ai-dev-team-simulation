# Task Template System Implementation Guide

## Overview

The Task Template System enables users to create reusable templates for common task patterns. Users can define default values for task fields (title, description, status, priority, estimated hours, labels) once, then quickly spawn new tasks with pre-filled values.

**Key benefit:** Reduces repetitive task creation and ensures consistency across similar task types.

## Architecture

### Data Layer

#### Types (`src/types/template.ts`)

```typescript
interface TaskTemplate {
  id: string
  name: string
  description?: string
  defaultFields: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    estimatedHours?: number
    labels?: string[]
  }
  createdAt: string
  updatedAt: string
}
```

### Query Hooks

#### `useTemplates()` - Fetch all templates

Query hook that fetches all task templates. Uses TanStack Query for automatic caching and refetching.

```typescript
import { useTemplates } from '@/hooks/useTemplates'

export function MyComponent() {
  const { data: templates, isLoading, error } = useTemplates()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {templates?.map((t) => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>
  )
}
```

**Query Key:** `['templates']`

### Mutation Hooks

#### `useCreateTemplate()` - Create a new template

Creates a new template with form validation. Uses optimistic updates for immediate UI feedback.

```typescript
const { mutate, isPending } = useCreateTemplate()

const handleCreate = (data) => {
  mutate(
    {
      name: 'Bug Fix',
      description: 'Standard template for bug fixes',
      defaultFields: {
        title: 'Fix: [Description]',
        priority: 'high',
        estimatedHours: 4,
      },
    },
    {
      onSuccess: () => console.log('Created'),
      onError: (error) => console.error(error.message),
    }
  )
}
```

**Features:**
- Template name uniqueness validation (server-side)
- Requires at least one default field to be set
- Optimistic updates with automatic rollback on error
- Cache invalidation on success

#### `useUpdateTemplate()` - Update an existing template

Updates template data with the same optimistic update pattern.

```typescript
const { mutate, isPending } = useUpdateTemplate()

const handleUpdate = (templateId, newData) => {
  mutate(
    { id: templateId, data: newData },
    {
      onSuccess: () => console.log('Updated'),
      onError: (error) => console.error(error.message),
    }
  )
}
```

#### `useDeleteTemplate()` - Delete a template

Removes a template from the system.

```typescript
const { mutate, isPending } = useDeleteTemplate()

const handleDelete = (templateId) => {
  mutate(templateId, {
    onSuccess: () => console.log('Deleted'),
    onError: (error) => console.error(error.message),
  })
}
```

#### `useCreateTaskFromTemplate()` - Create task from template

Creates a new task using template default fields. Overrides can be provided for any field.

```typescript
const { mutate, isPending } = useCreateTaskFromTemplate()

const handleCreateFromTemplate = () => {
  mutate(
    {
      templateFields: selectedTemplate.defaultFields,
      overrides: {
        name: 'Fix login bug in staging', // Override task name
        // other overrides...
      },
    },
    {
      onSuccess: (newTask) => console.log('Task created:', newTask),
      onError: (error) => console.error(error.message),
    }
  )
}
```

**Behavior:**
- Merges template default fields with provided overrides
- Task name is the only required override
- Falls back to template defaults for any non-overridden field
- Invalidates task list cache on success

### API Endpoints (MSW)

Located in `src/mocks/handlers/templates.ts`

#### GET /api/templates
Returns list of all templates.

```
Response: { data: TaskTemplate[] }
```

#### POST /api/templates
Creates a new template.

```
Body: CreateTemplateInput
Response: TaskTemplate (201)
Errors:
- 400: Missing required fields or validation failed
- 400: Template name not unique
```

#### PATCH /api/templates/:id
Updates an existing template.

```
Body: UpdateTemplateInput (partial)
Response: TaskTemplate (200)
Errors:
- 404: Template not found
- 400: Validation failed
```

#### DELETE /api/templates/:id
Deletes a template.

```
Response: 204 No Content
Errors:
- 404: Template not found
```

### Components

#### TemplateListPage (`src/pages/TemplateListPage.tsx`)

Main page for template management. Features:
- Display all templates in a grid
- Create new template button
- Edit/delete operations
- Empty state when no templates exist

```typescript
import { TemplateListPage } from '@/pages/TemplateListPage'

// Use in routing
export const Route = createFileRoute('/templates')({
  component: TemplateListPage,
})
```

#### TemplateFormDialog (`src/components/TemplateFormDialog.tsx`)

Modal dialog for creating/editing templates. Uses TanStack Form for validation.

**Props:**
```typescript
interface TemplateFormDialogProps {
  isOpen: boolean
  onClose: () => void
  initialTemplate?: TaskTemplate | null
}
```

**Features:**
- Controlled modal dialog
- TanStack Form validation
- Separate fields for template metadata and default task fields
- Auto-closes on successful save
- Displays API errors to user

#### TaskFromTemplateDialog (`src/components/TaskFromTemplateDialog.tsx`)

Dialog for spawning new tasks from templates.

**Props:**
```typescript
interface TaskFromTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
}
```

**UX Flow:**
1. User selects template from list
2. Each template shows preview of default fields
3. User enters task name
4. Dialog displays preview of what will be created
5. Submit creates task with merged data

#### TemplatePreviewCard (`src/components/TemplatePreviewCard.tsx`)

Grid card component showing template details and metadata.

**Features:**
- Template name and description
- Preview of default fields (formatted nicely)
- Edit/delete action buttons
- Creation date information

### Form Validation

#### Template Creation/Update Validation

Server-side validation rules (in MSW handler):

- `name`: Required, max 100 characters, must be unique
- `description`: Optional, max 500 characters
- `defaultFields`: At least one field must be set
- Field values must be valid types (priority: low/medium/high, status: valid enum, etc.)

Client-side validation (TanStack Form):

- Real-time field validation with error messages
- Visual feedback on invalid fields
- Submit button disabled until form is valid

## Usage Examples

### Basic Template Creation

```typescript
import { useCreateTemplate } from '@/hooks/useCreateTemplate'

export function CreateBugFixTemplate() {
  const { mutate } = useCreateTemplate()

  const handleCreate = () => {
    mutate({
      name: 'Bug Fix',
      description: 'Standard template for bug fixes',
      defaultFields: {
        title: 'Fix: [Brief description]',
        status: 'backlog',
        priority: 'high',
        estimatedHours: 4,
      },
    })
  }

  return <button onClick={handleCreate}>Create Bug Fix Template</button>
}
```

### Complete Template Management Flow

```typescript
import { useState } from 'react'
import { TemplateListPage } from '@/pages/TemplateListPage'
import { TaskFromTemplateDialog } from '@/components/TaskFromTemplateDialog'

export function TemplateFeature() {
  const [showTaskDialog, setShowTaskDialog] = useState(false)

  return (
    <>
      <TemplateListPage />
      <button onClick={() => setShowTaskDialog(true)}>
        Create Task from Template
      </button>
      <TaskFromTemplateDialog
        isOpen={showTaskDialog}
        onClose={() => setShowTaskDialog(false)}
      />
    </>
  )
}
```

## TanStack Query Patterns

### Query Keys

```typescript
// List all templates
['templates']
```

### Cache Invalidation

Templates cache is invalidated on:
- Create template → `invalidateQueries({ queryKey: ['templates'] })`
- Update template → `invalidateQueries({ queryKey: ['templates'] })`
- Delete template → `invalidateQueries({ queryKey: ['templates'] })`

Task cache is invalidated on:
- Create task from template → `invalidateQueries({ queryKey: ['tasks'] })`

### Stale Time & GC Time

Default values from TanStack Query (can be configured):
- `staleTime`: 0 (data is stale immediately)
- `gcTime`: 5 minutes (cache kept for 5 min after inactive)

## Error Handling

### User-Facing Errors

1. **Validation Errors**: Shown in form, field-level errors
2. **Duplicate Template Name**: Alert shown in form modal
3. **Network Errors**: Retry logic via `useMutationWithRetry`
4. **API Errors**: Generic error message displayed

### Error Recovery

- Optimistic updates automatically revert on error
- Failed mutations show error toast/modal
- User can retry operation
- No data loss on failed operations

## Testing

### MSW Handlers

The template MSW handlers simulate:
- In-memory template storage (not persisted)
- Full validation (required fields, unique names, etc.)
- Realistic error responses
- Sample templates on initialization

### Sample Templates (initialized in MSW)

```typescript
[
  {
    id: 'template-1',
    name: 'Bug Fix',
    description: 'Standard template for bug fixes',
    defaultFields: {
      title: 'Fix: [Brief description]',
      status: 'backlog',
      priority: 'high',
      estimatedHours: 4,
    },
    // ...
  },
  // More samples...
]
```

### Testing Components

1. **TemplateListPage**: Test CRUD operations, empty state, grid rendering
2. **TemplateFormDialog**: Test form validation, submission, error handling
3. **TaskFromTemplateDialog**: Test template selection, preview, task creation
4. **TemplatePreviewCard**: Test content rendering, action buttons

Example test:
```typescript
it('creates template with valid data', async () => {
  const { user } = render(<TemplateFormDialog isOpen />)

  await user.type(screen.getByPlaceholderText('e.g., Bug Fix'), 'Test Template')
  await user.type(screen.getByPlaceholderText('e.g., Fix: [Brief description]'), 'Test Title')

  await user.click(screen.getByText('Create Template'))

  // Verify API call and success message
})
```

## Limitations & Future Enhancements

### Current Scope (v1)

- ✅ Field templates only (no subtasks or task relationships)
- ✅ Basic field support (title, description, status, priority, hours, labels)
- ✅ Single-task creation from template
- ✅ Simple CRUD operations

### Not Implemented (Future)

- Task template categories/grouping
- Bulk task creation from single template
- Task dependency templates
- Subtask auto-creation from template
- Custom field support
- Template sharing/permissions
- Template cloning
- Usage statistics/tracking

## File Structure

```
src/
├── components/
│   ├── TemplateFormDialog.tsx
│   ├── TemplatePreviewCard.tsx
│   └── TaskFromTemplateDialog.tsx
├── hooks/
│   ├── useTemplates.ts
│   ├── useCreateTemplate.ts
│   ├── useUpdateTemplate.ts
│   ├── useDeleteTemplate.ts
│   └── useCreateTaskFromTemplate.ts
├── mocks/
│   └── handlers/
│       └── templates.ts
├── pages/
│   └── TemplateListPage.tsx
├── routes/
│   └── templates.tsx
└── types/
    └── template.ts
```

## Integration Checklist

- [x] Type definitions created
- [x] Query/mutation hooks implemented
- [x] MSW handlers registered
- [x] Components built (4 main components)
- [x] Router configured
- [x] Optimistic updates implemented
- [x] Error handling added
- [x] Form validation working
- [x] Empty states handled
- [x] Loading states implemented

## Performance Considerations

- Optimistic updates provide immediate UI feedback
- Query caching prevents unnecessary API calls
- Component lazy-loading can be added for large lists
- Virtual scrolling for 100+ templates (future)
- Debounced search if needed

## Accessibility

- Semantic HTML in all components
- ARIA labels on form fields and buttons
- Keyboard navigation in dialogs (Escape closes)
- Focus management in modals
- Clear error messages for screen readers
