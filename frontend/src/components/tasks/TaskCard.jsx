import { CalendarDays, LoaderCircle, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatTaskDueDate } from '../../utils/date'

const priorityStyles = {
  low: 'border-sky-100 bg-sky-50 text-sky-700',
  medium: 'border-amber-100 bg-amber-50 text-amber-700',
  high: 'border-rose-100 bg-rose-50 text-rose-700',
}

const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' }

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteError('')
    try {
      await onDelete(task.id)
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <article className="group flex min-h-[220px] min-w-0 flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/50 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={isChangingStatus}
          aria-label={`Change status for ${task.title}`}
          aria-busy={isChangingStatus}
          className="min-h-11 max-w-[116px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-500 outline-none transition duration-200 ease-out hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-wait disabled:opacity-60"
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      {statusError && <p role="alert" className="mt-2 text-xs font-medium text-rose-600">{statusError}</p>}
      {deleteError && <p role="alert" className="mt-2 text-xs font-medium text-rose-600">{deleteError}</p>}

      <h3 className="mt-4 line-clamp-2 text-base font-bold leading-5 text-slate-800">{task.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
        {task.description || 'No description added.'}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <span className={`min-w-0 max-w-[65%] truncate flex items-center gap-1.5 text-xs font-medium ${task.due_date ? 'text-slate-500' : 'text-slate-400'}`}>
          <CalendarDays size={14} className={task.due_date ? 'text-violet-500' : undefined} aria-hidden="true" />
          {formatTaskDueDate(task.due_date)}
        </span>
        <div className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            aria-label={`Delete ${task.title}`}
          >
            {isDeleting ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Trash2 size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  )
}
