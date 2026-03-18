import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useSprintRetrospective } from '../../hooks'
import type { SprintRetrospectiveData } from '../../types/sprint-retrospective'

interface SprintRetrospectivePanelProps {
  sprintId: string
  title?: string
}

/**
 * Sprint Retrospective Panel
 *
 * Comprehensive view of sprint retrospective data including velocity trends,
 * burndown analysis, and team performance metrics.
 *
 * Features:
 * - Velocity trend chart (last 6 sprints)
 * - Burndown comparison view (planned vs actual)
 * - Team performance metrics grid
 * - Loading and empty states
 * - Responsive layout
 * - Accessible markup
 */
export function SprintRetrospectivePanel({
  sprintId,
  title = 'Sprint Retrospective',
}: SprintRetrospectivePanelProps) {
  const { data, isLoading, error } = useSprintRetrospective(sprintId)

  if (isLoading) {
    return <LoadingSkeleton title={title} />
  }

  if (error || !data) {
    return <EmptyState title={title} />
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 text-sm">
          {new Date(data.period.startDate).toLocaleDateString()} -{' '}
          {new Date(data.period.endDate).toLocaleDateString()}
        </p>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Health Score"
          value={`${data.summary.healthScore}%`}
          description="Overall sprint health"
          color="blue"
        />
        <MetricCard
          label="Total Sprints"
          value={data.summary.totalSprintsAnalyzed}
          description="Analyzed"
          color="purple"
        />
        <MetricCard
          label="Velocity Trend"
          value={data.velocityTrend.trend}
          description="6-sprint trend"
          color={
            data.velocityTrend.trend === 'improving'
              ? 'green'
              : data.velocityTrend.trend === 'declining'
                ? 'red'
                : 'yellow'
          }
        />
        <MetricCard
          label="Completion Rate"
          value={`${Math.round(data.teamPerformance.metrics.completionRate)}%`}
          description="Tasks completed"
          color="emerald"
        />
      </div>

      {/* Velocity Trend Chart */}
      <VelocityTrendChart data={data} />

      {/* Burndown Comparison */}
      <BurndownComparisonChart data={data} />

      {/* Team Performance Metrics */}
      <TeamPerformanceGrid data={data} />

      {/* Key Insights */}
      {data.summary.keyInsights.length > 0 && (
        <InsightsSection
          title="Key Insights"
          items={data.summary.keyInsights}
          type="insight"
        />
      )}

      {/* Recommendations */}
      {data.summary.recommendations.length > 0 && (
        <InsightsSection
          title="Recommendations"
          items={data.summary.recommendations}
          type="recommendation"
        />
      )}
    </div>
  )
}

/**
 * Metric Card - displays a single metric with label and value
 */
function MetricCard({
  label,
  value,
  description,
  color,
}: {
  label: string
  value: string | number
  description: string
  color: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'emerald'
}) {
  const colorClasses = {
    blue: 'bg-blue-900/20 border-blue-700 text-blue-300',
    purple: 'bg-purple-900/20 border-purple-700 text-purple-300',
    green: 'bg-green-900/20 border-green-700 text-green-300',
    red: 'bg-red-900/20 border-red-700 text-red-300',
    yellow: 'bg-yellow-900/20 border-yellow-700 text-yellow-300',
    emerald: 'bg-emerald-900/20 border-emerald-700 text-emerald-300',
  }

  return (
    <div className={`rounded-lg p-4 border ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  )
}

/**
 * Velocity Trend Chart - shows planned vs actual velocity over 6 sprints
 */
function VelocityTrendChart({ data }: { data: SprintRetrospectiveData }) {
  if (!data.velocityTrend.dataPoints || data.velocityTrend.dataPoints.length === 0) {
    return null
  }

  const chartData = data.velocityTrend.dataPoints.map((point) => ({
    name: point.sprintName,
    planned: point.plannedVelocity,
    actual: point.actualVelocity,
  }))

  return (
    <div
      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      role="region"
      aria-label="Velocity trend chart for last 6 sprints"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Velocity Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            aria-hidden={true}
          />
          <YAxis
            stroke="#94a3b8"
            label={{ value: 'Velocity (tasks)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
            formatter={(value) => (typeof value === 'number' ? value.toFixed(0) : value)}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            aria-label="Chart legend: Planned and Actual velocity"
          />
          <Line
            type="monotone"
            dataKey="planned"
            stroke="#3b82f6"
            dot={true}
            name="Planned Velocity"
            aria-label="Planned velocity line"
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#10b981"
            dot={true}
            name="Actual Velocity"
            aria-label="Actual velocity line"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-slate-400">
        <p>Average Velocity: {data.velocityTrend.average.toFixed(1)} tasks</p>
        <p>Trend: {data.velocityTrend.trend}</p>
      </div>
    </div>
  )
}

/**
 * Burndown Comparison Chart - shows steady burndown vs actual for current sprint
 */
function BurndownComparisonChart({ data }: { data: SprintRetrospectiveData }) {
  if (!data.burndownAnalysis.current) {
    return null
  }

  const current = data.burndownAnalysis.current
  const comparison = data.burndownAnalysis.comparison

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      role="region"
      aria-label="Burndown analysis"
    >
      {/* Current Sprint Burndown Stats */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Current Sprint Burndown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
            <span className="text-slate-300">Total Tasks</span>
            <span className="text-xl font-bold text-white">{current.totalTasks}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
            <span className="text-slate-300">Completed Tasks</span>
            <span className="text-xl font-bold text-emerald-400">{current.completedTasks}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
            <span className="text-slate-300">Burndown Rate</span>
            <span className="text-xl font-bold text-blue-400">
              {current.burndownRate.toFixed(2)}/day
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded">
            <span className="text-slate-300">Steadiness</span>
            <span
              className={`text-xl font-bold ${
                current.steadiness > 70
                  ? 'text-green-400'
                  : current.steadiness > 40
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              {current.steadiness.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Burndown Pattern Analysis */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Burndown Pattern</h3>
        <div className="space-y-3">
          <div
            className={`p-3 rounded ${
              current.hasEarlyBurst ? 'bg-green-900/20' : 'bg-slate-700/50'
            }`}
          >
            <p className="text-slate-300 text-sm">
              <span className={current.hasEarlyBurst ? 'text-green-400' : 'text-slate-400'}>
                {current.hasEarlyBurst ? '✓' : '○'}
              </span>{' '}
              Early Burst
            </p>
            <p className="text-slate-500 text-xs">Fast start with high completion early</p>
          </div>
          <div
            className={`p-3 rounded ${
              current.hasEndSpurt ? 'bg-blue-900/20' : 'bg-slate-700/50'
            }`}
          >
            <p className="text-slate-300 text-sm">
              <span className={current.hasEndSpurt ? 'text-blue-400' : 'text-slate-400'}>
                {current.hasEndSpurt ? '✓' : '○'}
              </span>{' '}
              End Spurt
            </p>
            <p className="text-slate-500 text-xs">Increased activity towards sprint end</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded">
            <p className="text-slate-300 text-sm">Peak Completion Day: {current.peakCompletionDay}</p>
            <p className="text-slate-500 text-xs">
              Day with highest completion rate in sprint
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      {comparison && (
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Cross-Sprint Comparison</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-300 text-sm mb-1">Average Burndown Rate</p>
              <p className="text-2xl font-bold text-blue-400">
                {comparison.averageBurndownRate.toFixed(2)}/day
              </p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-300 text-sm mb-1">Average Steadiness</p>
              <p className="text-2xl font-bold text-emerald-400">
                {comparison.avgSteadiness.toFixed(0)}%
              </p>
            </div>
            <div className="p-3 bg-slate-700/50 rounded">
              <p className="text-slate-300 text-sm mb-1">Trend</p>
              <p
                className={`text-2xl font-bold ${
                  comparison.improvementTrend === 'improving'
                    ? 'text-green-400'
                    : comparison.improvementTrend === 'declining'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                }`}
              >
                {comparison.improvementTrend}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Team Performance Grid - displays metrics like completion rate, cycle time, etc.
 */
function TeamPerformanceGrid({ data }: { data: SprintRetrospectiveData }) {
  const metrics = data.teamPerformance.metrics

  return (
    <div
      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      role="region"
      aria-label="Team performance metrics"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Team Performance Metrics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <MetricBox
          label="Completion Rate"
          value={`${Math.round(metrics.completionRate)}%`}
          color="emerald"
        />
        <MetricBox
          label="Avg Cycle Time"
          value={`${metrics.avgCycleTime.toFixed(1)}h`}
          color="blue"
        />
        <MetricBox
          label="Tasks Completed"
          value={metrics.tasksCompleted}
          color="purple"
        />
        <MetricBox
          label="Tasks In Progress"
          value={metrics.tasksInProgress}
          color="yellow"
        />
        <MetricBox
          label="Tasks Canceled"
          value={metrics.tasksCanceled}
          color="red"
        />
        <MetricBox
          label="Capacity Utilization"
          value={`${Math.round(metrics.capacityUtilization)}%`}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/50 rounded">
          <p className="text-slate-400 text-sm mb-2">Team Size</p>
          <p className="text-3xl font-bold text-white">{metrics.teamSize}</p>
          <p className="text-slate-500 text-xs mt-2">
            Avg {metrics.avgTasksPerMember.toFixed(1)} tasks/member
          </p>
        </div>
        <div className="p-4 bg-slate-700/50 rounded">
          <p className="text-slate-400 text-sm mb-2">Sprint Name</p>
          <p className="text-2xl font-bold text-white truncate">{data.sprintName}</p>
        </div>
      </div>

      {/* Agent Performance Details */}
      {data.teamPerformance.byAgent && data.teamPerformance.byAgent.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Agent performance breakdown">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-3 font-semibold text-slate-300">Agent</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-300">Tasks</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-300">Avg Cycle</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-300">Velocity %</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-300">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {data.teamPerformance.byAgent.map((agent) => (
                <tr key={agent.agentId} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="py-3 px-3 text-slate-300">{agent.agentName}</td>
                  <td className="text-right py-3 px-3 text-slate-300">{agent.tasksCompleted}</td>
                  <td className="text-right py-3 px-3 text-slate-300">
                    {agent.avgCycleTime.toFixed(1)}h
                  </td>
                  <td className="text-right py-3 px-3 text-blue-400">
                    {agent.velocityContribution.toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-3">
                    <div className="flex justify-end items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(agent.capacityUtilization, 100)}%` }}
                          role="progressbar"
                          aria-valuenow={agent.capacityUtilization}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${agent.agentName} capacity utilization`}
                        />
                      </div>
                      <span className="text-xs text-slate-400">
                        {Math.round(agent.capacityUtilization)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/**
 * Metric Box - compact metric display
 */
function MetricBox({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: 'emerald' | 'blue' | 'purple' | 'yellow' | 'red' | 'indigo'
}) {
  const colorClasses = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    indigo: 'text-indigo-400',
  }

  return (
    <div className="p-4 bg-slate-700/50 rounded">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  )
}

/**
 * Insights Section - displays key insights or recommendations
 */
function InsightsSection({
  title,
  items,
  type,
}: {
  title: string
  items: string[]
  type: 'insight' | 'recommendation'
}) {
  const iconColor = type === 'insight' ? 'text-blue-400' : 'text-amber-400'
  const bgColor = type === 'insight' ? 'bg-blue-900/20' : 'bg-amber-900/20'

  return (
    <div
      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      role="region"
      aria-label={title}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className={`p-3 rounded ${bgColor} flex gap-3`}>
            <span className={`flex-shrink-0 ${iconColor}`}>
              {type === 'insight' ? '💡' : '✨'}
            </span>
            <span className="text-slate-200 text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Loading Skeleton - shows while data is fetching
 */
function LoadingSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-700 rounded w-1/4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse"
          >
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-700 rounded w-2/3 mb-2" />
            <div className="h-3 bg-slate-700 rounded w-1/3" />
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/4 mb-4" />
        <div className="h-64 bg-slate-700 rounded" />
      </div>
    </div>
  )
}

/**
 * Empty State - shows when no data is available
 */
function EmptyState({ title }: { title: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
      <div className="mb-4 text-4xl">📊</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">
        No retrospective data available for this sprint yet. Complete the sprint and try again.
      </p>
    </div>
  )
}
