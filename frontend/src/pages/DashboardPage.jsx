import { Activity, CheckCircle2, Clock3, ListTodo } from 'lucide-react'
import { StatCard } from '../components/StatCard'
import { StatusChart } from '../components/StatusChart'

export function DashboardPage({ tasks, summary, isLoading, error, onRetry }) {
  if (isLoading) return <LoadingState label="Loading workspace..." />
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  const recentTasks = tasks.slice(0, 5)

  return <div className="space-y-8">
    <header><p className="text-sm font-semibold text-violet-600">Overview</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Good morning, welcome back.</h1><p className="mt-2 text-slate-500">Here&apos;s what&apos;s happening with your workspace today.</p></header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total tasks" value={summary.total} icon={ListTodo} accent="bg-violet-50 text-violet-600" helper="Across your workspace" />
      <StatCard label="To do" value={summary.todo} icon={Clock3} accent="bg-amber-50 text-amber-600" helper="Waiting to be started" />
      <StatCard label="In progress" value={summary.in_progress} icon={Activity} accent="bg-blue-50 text-blue-600" helper="Currently active" />
      <StatCard label="Completed" value={summary.done} icon={CheckCircle2} accent="bg-emerald-50 text-emerald-600" helper="Successfully finished" />
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Task status</h2><p className="mt-1 text-sm text-slate-500">A snapshot of your current workload.</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">{summary.total} total</span></div>
        <StatusChart summary={summary} />
        <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold text-slate-500">
          {['To do', 'In progress', 'Done'].map((label, index) => <span key={label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ['#7C3AED', '#A78BFA', '#C4B5FD'][index] }} />{label}</span>)}
        </div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100 sm:p-6">
        <div><h2 className="font-bold text-slate-900">Recent tasks</h2><p className="mt-1 text-sm text-slate-500">Your latest activity.</p></div>
        <div className="mt-5 divide-y divide-slate-100">
          {recentTasks.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No tasks created yet.</p> : recentTasks.map((task) => <div key={task.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-700">{task.title}</p><p className="mt-1 text-xs capitalize text-slate-400">{task.priority} priority</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${task.status === 'done' ? 'bg-emerald-50 text-emerald-600' : task.status === 'in_progress' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>{task.status === 'in_progress' ? 'In progress' : task.status === 'done' ? 'Done' : 'To do'}</span></div>)}
        </div>
      </section>
    </div>
  </div>
}

function LoadingState({ label }) {
  return <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-400">{label}</div>
}

function ErrorState({ message, onRetry }) {
  return <div className="mx-auto mt-16 max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm"><p className="font-bold text-slate-900">Couldn&apos;t load the workspace</p><p className="mt-2 text-sm text-slate-500">{message}</p><button onClick={onRetry} className="button-primary mt-5">Try again</button></div>
}
