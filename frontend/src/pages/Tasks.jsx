import { useState } from 'react'
import { KanbanBoard } from '../components/tasks/KanbanBoard'
import { TaskModal } from '../components/TaskModal'

export function Tasks({ tasks, isLoading, error, onRetry, onCreate, onUpdate, onStatusChange, onDelete }) {
  const [modalTask, setModalTask] = useState(undefined)

  const handleSubmit = (values) => modalTask ? onUpdate(modalTask.id, values) : onCreate(values)

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-slate-400">Loading tasks...</div>
  if (error) return <ErrorState message={error} onRetry={onRetry} />

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-violet-600">Workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Tasks</h1>
          <p className="mt-2 text-slate-500">Plan, organize and track your work.</p>
        </div>
        <button onClick={() => setModalTask(null)} className="button-primary self-start sm:self-auto">New task</button>
      </header>

      <KanbanBoard tasks={tasks} onEdit={setModalTask} onDelete={onDelete} onStatusChange={onStatusChange} />
      {modalTask !== undefined && <TaskModal task={modalTask} onClose={() => setModalTask(undefined)} onSubmit={handleSubmit} />}
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
      <p className="font-bold text-slate-900">Couldn&apos;t load tasks</p>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      <button onClick={onRetry} className="button-primary mt-5">Try again</button>
    </div>
  )
}

export default Tasks
