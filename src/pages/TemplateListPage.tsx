import { useState } from 'react'
import { useTemplates } from '../hooks/useTemplates'
import { useDeleteTemplate } from '../hooks/useDeleteTemplate'
import { TemplateFormDialog } from '../components/TemplateFormDialog'
import { TemplatePreviewCard } from '../components/TemplatePreviewCard'
import type { TaskTemplate } from '../types/template'

/**
 * Template management page
 *
 * Displays all task templates in a grid/list with options to:
 * - Create new templates
 * - Edit existing templates
 * - Delete templates
 * - View template previews
 */
export function TemplateListPage() {
  const { data: templates, isLoading, error } = useTemplates()
  const { mutate: deleteTemplate, isPending: isDeleting } = useDeleteTemplate()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(
    null
  )

  const handleCreateNew = () => {
    setEditingTemplate(null)
    setIsFormOpen(true)
  }

  const handleEdit = (template: TaskTemplate) => {
    setEditingTemplate(template)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTemplate(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading templates</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Templates</h1>
          <p className="text-gray-600 mt-1">
            Create reusable templates to reduce repetitive task creation
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Template
        </button>
      </div>

      {/* Empty State */}
      {!templates || templates.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-gray-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first template to get started with faster task creation
          </p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplatePreviewCard
              key={template.id}
              template={template}
              onEdit={() => handleEdit(template)}
              onDelete={() => handleDelete(template.id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <TemplateFormDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        initialTemplate={editingTemplate}
      />
    </div>
  )
}
