import { Activity, CalendarClock, CheckCircle2, CircleDashed, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/dashboard/StatCard'
import { StatusChart } from '../components/dashboard/StatusChart'
import { formatTaskDueDate, toDateInputValue } from '../utils/date'

const priorityStyles = {
  low: 'bg-sky-50 text-sky-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
}

function getDashboardMetrics(tasks) {
  const completed = tasks.filter((task) => task.status === 'done').length
  return {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    completed,
    completedPercentage: tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100),
  }
}

function formatDueDate(date) {
  return formatTaskDueDate(date)
}

export function Dashboard({ tasks, summary, isLoading, error, onRetry }) {
  if (isLoading) return <DashboardSkeleton />
  if (error) return <ErrorState message={error} onRetry={onRetry} />

  const metrics = summary
    ? {
        total: summary.total,
        todo: summary.todo,
        inProgress: summary.in_progress,
        completed: summary.done,
        completedPercentage: summary.total === 0 ? 0 : Math.round((summary.done / summary.total) * 100),
      }
    : getDashboardMetrics(tasks)
  const statusData = [
    { name: 'To do', value: metrics.todo },
    { name: 'In progress', value: metrics.inProgress },
    { name: 'Completed', value: metrics.completed },
  ].filter((item) => item.value > 0)
  const upcomingTasks = [...tasks]
    .filter((task) => toDateInputValue(task.due_date))
    .sort((first, second) => toDateInputValue(first.due_date).localeCompare(toDateInputValue(second.due_date)))
    .slice(0, 5)

  return (
    <div className="min-w-0 space-y-8">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Workspace overview</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Good morning, welcome back.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">Here&apos;s what&apos;s happening with your workspace today.</p>
      </header>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tasks" value={metrics.total} icon={ListTodo} iconClassName="bg-violet-50 text-violet-600" helper="Across your workspace" />
        <StatCard label="To Do" value={metrics.todo} icon={CircleDashed} iconClassName="bg-amber-50 text-amber-600" helper="Waiting to be started" />
        <StatCard label="In Progress" value={metrics.inProgress} icon={Activity} iconClassName="bg-blue-50 text-blue-600" helper="Currently active" />
        <StatCard label="Completed" value={metrics.completed} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-600" helper={`${metrics.completedPercentage}% of all tasks`} />
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Task status</h2>
              <p className="mt-1 text-sm text-slate-500">Distribution across your workflow.</p>
            </div>
            <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">{metrics.total} total</span>
          </div>
          {statusData.length === 0 ? (
            <div className="mt-5"><StatusChart data={statusData} completedPercentage={metrics.completedPercentage} /></div>
          ) : (
            <>
              <StatusChart data={statusData} completedPercentage={metrics.completedPercentage} />
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                {statusData.map((item, index) => (
                  <span key={item.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full ring-4 ring-slate-50" style={{ backgroundColor: ['#7C3AED', '#8B5CF6', '#C4B5FD'][index] }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming deadlines</h2>
              <p className="mt-1 text-sm text-slate-500">The next tasks on your calendar.</p>
            </div>
            <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
              <CalendarClock size={18} aria-hidden="true" />
            </div>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center text-center text-sm text-slate-400">
              No upcoming tasks yet.
            </div>
          ) : (
            <div className="mt-2 divide-y divide-slate-100">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-4 rounded-xl py-3.5 transition-colors hover:bg-slate-50/80 sm:px-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-700">{task.title}</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <CalendarClock size={13} aria-hidden="true" />
                      {formatDueDate(task.due_date)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${priorityStyles[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">Your dashboard is ready for your first task.</p>
          <p className="mt-2 text-sm text-slate-400">Create a task to start tracking your progress.</p>
          <Link to="/tasks" className="button-primary mt-5">Create your first task</Link>
        </div>
      )}
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm" role="alert">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">!</div>
      <p className="font-bold text-slate-900">Couldn&apos;t load the dashboard</p>
      <p className="mt-2 text-sm leading-5 text-slate-500">{message || 'Please check your connection and try again.'}</p>
      <button onClick={onRetry} className="button-primary mt-5">Try again</button>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-w-0 space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-slate-200/80" />
        <div className="h-5 w-full max-w-md animate-pulse rounded bg-slate-200/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[390px] animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />
        <div className="h-[390px] animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm" />
      </div>
    </div>
  )
}

export default Dashboard
