/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from '@tanstack/react-router'
import { TaskTable } from '../components/TaskTable/TaskTable'
import { useTasks } from '../hooks/useTasks'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const { data: tasks = [], isLoading, isError } = useTasks()

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage and track your team tasks</p>
        </div>
        <TaskTable tasks={tasks} isLoading={isLoading} isError={isError} />
      </div>
    </main>
  )
}
