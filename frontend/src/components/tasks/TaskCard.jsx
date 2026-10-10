import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

const priorityStyles = {
  low: 'bg-sky-50 text-sky-700',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
}

const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' }

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value
    setIsChangingStatus(true)
    setStatusError('')

    try {
      await onStatusChange(task.id, nextStatus)
    } catch (error) {
      setStatusError(error.message)
    } finally {
      setIsChangingStatus(false)
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={isChangingStatus}
          aria-label={`Change status for ${task.title}`}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-500 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-wait disabled:opacity-60"
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {statusError && <p role="alert" className="mt-2 text-xs font-medium text-rose-600">{statusError}</p>}

      <h3 className="mt-4 font-bold leading-5 text-slate-800">{task.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
        {task.description || 'No description added.'}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <CalendarDays size={14} />
          {task.due_date ? new Date(`${task.due_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-violet-600"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  )
}
