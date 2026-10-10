import { Activity, CalendarClock, CheckCircle2, CircleDashed, ListTodo } from 'lucide-react'
import { StatCard } from '../components/dashboard/StatCard'
import { StatusChart } from '../components/dashboard/StatusChart'

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
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function Dashboard({ tasks, summary, isLoading, error, onRetry }) {
  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-400">Loading dashboard...</div>
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
  const upcomingTasks = [...tasks].filter((task) => task.due_date).sort((first, second) => first.due_date.localeCompare(second.due_date)).slice(0, 5)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-violet-600">Overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Good morning, welcome back.
        </h1>
        <p className="mt-2 text-slate-500">Here&apos;s what&apos;s happening with your workspace today.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tasks" value={metrics.total} icon={ListTodo} iconClassName="bg-violet-50 text-violet-600" helper="Across your workspace" />
        <StatCard label="To Do" value={metrics.todo} icon={CircleDashed} iconClassName="bg-amber-50 text-amber-600" helper="Waiting to be started" />
        <StatCard label="In Progress" value={metrics.inProgress} icon={Activity} iconClassName="bg-blue-50 text-blue-600" helper="Currently active" />
        <StatCard label="Completed" value={metrics.completed} icon={CheckCircle2} iconClassName="bg-emerald-50 text-emerald-600" helper={`${metrics.completedPercentage}% of all tasks`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900">Task status</h2>
              <p className="mt-1 text-sm text-slate-500">Distribution across your workflow.</p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">{metrics.total} total</span>
          </div>
          {statusData.length === 0 ? (
            <div className="mt-5"><StatusChart data={statusData} completedPercentage={metrics.completedPercentage} /></div>
          ) : (
            <>
              <StatusChart data={statusData} completedPercentage={metrics.completedPercentage} />
              <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold text-slate-500">
                {statusData.map((item, index) => (
                  <span key={item.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#7C3AED', '#A78BFA', '#C4B5FD'][index] }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900">Upcoming deadlines</h2>
              <p className="mt-1 text-sm text-slate-500">The next tasks on your calendar.</p>
            </div>
            <CalendarClock className="text-violet-500" size={20} />
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center text-center text-sm text-slate-400">
              No upcoming tasks yet.
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">{task.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <CalendarClock size={13} />
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
        </div>
      )}
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
      <p className="font-bold text-slate-900">Couldn&apos;t load the dashboard</p>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <button onClick={onRetry} className="button-primary mt-5">Try again</button>
    </div>
  )
}

export default Dashboard
