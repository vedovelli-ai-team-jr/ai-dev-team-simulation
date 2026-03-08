import { createFileRoute } from '@tanstack/react-router'
import { TemplateListPage } from '../pages/TemplateListPage'

export const Route = createFileRoute('/templates')({
  component: TemplateListPage,
  meta: () => [
    {
      title: 'Task Templates',
    },
  ],
})
