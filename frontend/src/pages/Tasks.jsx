import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { KanbanBoard } from '../components/tasks/KanbanBoard'
import { TaskModal } from '../components/TaskModal'

export function Tasks({ tasks, isLoading, error, onRetry, onCreate, onUpdate, onStatusChange, onDelete, readOnly = false }) {
  const [modalTask, setModalTask] = useState(undefined)
  const [notice, setNotice] = useState('')

  const handleSubmit = async (values) => {
    if (modalTask) {
      await onUpdate(modalTask.id, values)
      setNotice('Task updated successfully.')
    } else {
      await onCreate(values)
      setNotice('Task created successfully.')
    }
  }

  const handleStatusChange = async (id, status) => {
    await onStatusChange(id, status)
    setNotice('Task status updated.')
  }

  const handleDelete = (id) => onDelete(id).then(() => setNotice('Task deleted successfully.'))

  if (isLoading) return <KanbanSkeleton />
  if (error) return <ErrorState message={error} onRetry={onRetry} />

  return (
    <div className="space-y-8">
      {readOnly && (
        <div
          role="status"
          className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700"
        >
          Demo mode — read only
        </div>
      )}
      {notice && <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17} aria-hidden="true" />{notice}<button className="ml-auto rounded-md px-2 py-1 text-xs underline hover:bg-emerald-100" onClick={() => setNotice('')}>Dismiss</button></div>}
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Workspace tasks</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Tasks</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">Plan, organize and track your work.</p>
        </div>
        {!readOnly && <button onClick={() => { setNotice(''); setModalTask(null) }} className="button-primary self-start sm:self-auto">New task</button>}
      </header>

      <KanbanBoard tasks={tasks} onEdit={setModalTask} onDelete={handleDelete} onStatusChange={handleStatusChange} readOnly={readOnly} />
      {!readOnly && modalTask !== undefined && <TaskModal task={modalTask} onClose={() => setModalTask(undefined)} onSubmit={handleSubmit} />}
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm" role="alert">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">!</div>
      <p className="font-bold text-slate-900">Couldn&apos;t load tasks</p>
      <p className="mt-2 text-sm leading-5 text-slate-500">{message || 'Please check your connection and try again.'}</p>
      <button onClick={onRetry} className="button-primary mt-5">Try again</button>
    </div>
  )
}

function KanbanSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading tasks">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200/80" />
          <div className="h-5 w-64 animate-pulse rounded bg-slate-200/60" />
        </div>
        <div className="h-11 w-32 animate-pulse rounded-xl bg-slate-200" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((column) => (
          <div key={column} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="h-12 animate-pulse rounded-xl bg-slate-200/70" />
            {[1, 2].map((card) => <div key={card} className="h-56 animate-pulse rounded-xl bg-white shadow-sm" />)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks
