/**
 * MSW Handlers for Task Template Management
 *
 * Mock API endpoints for template CRUD:
 * - List all templates
 * - Create a new template
 * - Update an existing template
 * - Delete a template
 */

import { http, HttpResponse } from 'msw'
import type { TaskTemplate, CreateTemplateInput, UpdateTemplateInput } from '../../types/template'

// In-memory template storage for mock data
const templates = new Map<string, TaskTemplate>()

// Initialize with sample templates
function initializeSampleTemplates() {
  const sampleTemplates: TaskTemplate[] = [
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
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z',
    },
    {
      id: 'template-2',
      name: 'Feature Development',
      description: 'Template for new feature work',
      defaultFields: {
        title: 'Feature: [Brief description]',
        status: 'backlog',
        priority: 'medium',
        estimatedHours: 8,
      },
      createdAt: '2026-03-02T10:00:00Z',
      updatedAt: '2026-03-02T10:00:00Z',
    },
    {
      id: 'template-3',
      name: 'Documentation',
      description: 'Template for documentation tasks',
      defaultFields: {
        title: 'Docs: [Topic]',
        status: 'backlog',
        priority: 'low',
        estimatedHours: 3,
      },
      createdAt: '2026-03-03T10:00:00Z',
      updatedAt: '2026-03-03T10:00:00Z',
    },
  ]

  sampleTemplates.forEach((t) => templates.set(t.id, t))
}

// Initialize on module load
initializeSampleTemplates()

/**
 * Validate template data
 */
function validateTemplate(data: CreateTemplateInput | UpdateTemplateInput): {
  isValid: boolean
  errors?: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.name = 'Template name is required'
  }

  if (data.name && typeof data.name === 'string' && data.name.length > 100) {
    errors.name = 'Template name must be less than 100 characters'
  }

  if (
    data.description &&
    typeof data.description === 'string' &&
    data.description.length > 500
  ) {
    errors.description = 'Description must be less than 500 characters'
  }

  // Check if at least one default field is set
  if (data.defaultFields) {
    const hasField =
      data.defaultFields.title ||
      data.defaultFields.description ||
      data.defaultFields.status ||
      data.defaultFields.priority ||
      data.defaultFields.estimatedHours ||
      (data.defaultFields.labels && data.defaultFields.labels.length > 0)

    if (!hasField) {
      errors.defaultFields = 'At least one default field must be set'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

/**
 * Check for unique template name
 */
function isTemplateNameUnique(name: string, excludeId?: string): boolean {
  for (const [id, template] of templates) {
    if (id !== excludeId && template.name.toLowerCase() === name.toLowerCase()) {
      return false
    }
  }
  return true
}

/**
 * MSW handlers for template endpoints
 */
export const templateHandlers = [
  /**
   * GET /api/templates
   * Returns list of all templates
   */
  http.get('/api/templates', () => {
    const templateList = Array.from(templates.values())

    return HttpResponse.json(
      {
        data: templateList,
      },
      { status: 200 }
    )
  }),

  /**
   * GET /api/templates/:id
   * Returns a specific template by ID
   */
  http.get('/api/templates/:id', ({ params }) => {
    const { id } = params
    const template = templates.get(id as string)

    if (!template) {
      return HttpResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(template, { status: 200 })
  }),

  /**
   * POST /api/templates
   * Creates a new template
   */
  http.post('/api/templates', async ({ request }) => {
    try {
      const data = (await request.json()) as CreateTemplateInput

      // Validate
      const validation = validateTemplate(data)
      if (!validation.isValid) {
        return HttpResponse.json(
          { error: 'Validation failed', details: validation.errors },
          { status: 400 }
        )
      }

      // Check name uniqueness
      if (!isTemplateNameUnique(data.name)) {
        return HttpResponse.json(
          { error: 'Template name must be unique' },
          { status: 400 }
        )
      }

      // Create template
      const newTemplate: TaskTemplate = {
        id: `template-${Date.now()}`,
        name: data.name,
        description: data.description,
        defaultFields: data.defaultFields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      templates.set(newTemplate.id, newTemplate)

      return HttpResponse.json(newTemplate, { status: 201 })
    } catch (error) {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
  }),

  /**
   * PATCH /api/templates/:id
   * Updates an existing template
   */
  http.patch('/api/templates/:id', async ({ params, request }) => {
    try {
      const { id } = params
      const data = (await request.json()) as UpdateTemplateInput

      const template = templates.get(id as string)
      if (!template) {
        return HttpResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }

      // Validate
      const validation = validateTemplate(data)
      if (!validation.isValid) {
        return HttpResponse.json(
          { error: 'Validation failed', details: validation.errors },
          { status: 400 }
        )
      }

      // Check name uniqueness if changing name
      if (data.name && data.name !== template.name) {
        if (!isTemplateNameUnique(data.name, id as string)) {
          return HttpResponse.json(
            { error: 'Template name must be unique' },
            { status: 400 }
          )
        }
      }

      // Update template
      const updatedTemplate: TaskTemplate = {
        ...template,
        name: data.name !== undefined ? data.name : template.name,
        description:
          data.description !== undefined ? data.description : template.description,
        defaultFields:
          data.defaultFields !== undefined
            ? data.defaultFields
            : template.defaultFields,
        updatedAt: new Date().toISOString(),
      }

      templates.set(id as string, updatedTemplate)

      return HttpResponse.json(updatedTemplate, { status: 200 })
    } catch (error) {
      return HttpResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }
  }),

  /**
   * DELETE /api/templates/:id
   * Deletes a template
   */
  http.delete('/api/templates/:id', ({ params }) => {
    const { id } = params

    if (!templates.has(id as string)) {
      return HttpResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    templates.delete(id as string)

    return HttpResponse.json(undefined, { status: 204 })
  }),
]
