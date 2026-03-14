/**
 * StatusIndicators Examples
 *
 * This file demonstrates the usage of TaskStatusBadge, SprintProgressBar,
 * and TaskPriorityIndicator components for consistent UI across the app.
 */

import { TaskStatusBadge, SprintProgressBar, TaskPriorityIndicator } from './index'

export function TaskStatusBadgeExamples() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Task Status Badge</h2>
        <div className="space-y-3 bg-slate-800 p-4 rounded border border-slate-700">
          <div>
            <p className="text-sm text-slate-400 mb-2">Default size (md):</p>
            <div className="flex gap-2">
              <TaskStatusBadge status="backlog" />
              <TaskStatusBadge status="in-progress" />
              <TaskStatusBadge status="in-review" />
              <TaskStatusBadge status="done" />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Small size (sm):</p>
            <div className="flex gap-2">
              <TaskStatusBadge status="backlog" size="sm" />
              <TaskStatusBadge status="in-progress" size="sm" />
              <TaskStatusBadge status="in-review" size="sm" />
              <TaskStatusBadge status="done" size="sm" />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Large size (lg):</p>
            <div className="flex gap-2">
              <TaskStatusBadge status="backlog" size="lg" />
              <TaskStatusBadge status="in-progress" size="lg" />
              <TaskStatusBadge status="in-review" size="lg" />
              <TaskStatusBadge status="done" size="lg" />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Outline variant:</p>
            <div className="flex gap-2">
              <TaskStatusBadge status="backlog" variant="outline" />
              <TaskStatusBadge status="in-progress" variant="outline" />
              <TaskStatusBadge status="in-review" variant="outline" />
              <TaskStatusBadge status="done" variant="outline" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Sprint Progress Bar</h2>
        <div className="space-y-4 bg-slate-800 p-4 rounded border border-slate-700">
          <div>
            <p className="text-sm text-slate-400 mb-2">0% Progress:</p>
            <SprintProgressBar completedCount={0} totalCount={20} />
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">50% Progress:</p>
            <SprintProgressBar completedCount={10} totalCount={20} />
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">100% Progress (complete):</p>
            <SprintProgressBar completedCount={20} totalCount={20} />
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Without animation:</p>
            <SprintProgressBar completedCount={12} totalCount={20} animated={false} />
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Without percentage label:</p>
            <SprintProgressBar completedCount={8} totalCount={15} showPercentage={false} />
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Small height:</p>
            <SprintProgressBar completedCount={6} totalCount={12} height="sm" />
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Large height:</p>
            <SprintProgressBar completedCount={9} totalCount={12} height="lg" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Task Priority Indicator</h2>
        <div className="space-y-4 bg-slate-800 p-4 rounded border border-slate-700">
          <div>
            <p className="text-sm text-slate-400 mb-2">Priority levels (with icon):</p>
            <div className="space-y-2">
              <div>
                <TaskPriorityIndicator priority="low" showIcon={true} />
              </div>
              <div>
                <TaskPriorityIndicator priority="medium" showIcon={true} />
              </div>
              <div>
                <TaskPriorityIndicator priority="high" showIcon={true} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Text only (no icon):</p>
            <div className="space-y-2">
              <div>
                <TaskPriorityIndicator priority="low" showIcon={false} />
              </div>
              <div>
                <TaskPriorityIndicator priority="medium" showIcon={false} />
              </div>
              <div>
                <TaskPriorityIndicator priority="high" showIcon={false} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Small size:</p>
            <div className="space-y-2">
              <TaskPriorityIndicator priority="low" size="sm" />
              <TaskPriorityIndicator priority="medium" size="sm" />
              <TaskPriorityIndicator priority="high" size="sm" />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Large size:</p>
            <div className="space-y-2">
              <TaskPriorityIndicator priority="low" size="lg" />
              <TaskPriorityIndicator priority="medium" size="lg" />
              <TaskPriorityIndicator priority="high" size="lg" />
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-400 mb-2">Stacked layout:</p>
            <div className="space-y-2">
              <TaskPriorityIndicator priority="low" variant="stacked" />
              <TaskPriorityIndicator priority="medium" variant="stacked" />
              <TaskPriorityIndicator priority="high" variant="stacked" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
