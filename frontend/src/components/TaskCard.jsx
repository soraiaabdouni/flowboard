import { CalendarDays, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

const priorityStyles = { low: 'bg-sky-50 text-sky-700', medium: 'bg-amber-50 text-amber-700', high: 'bg-rose-50 text-rose-700' }
const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' }

export function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const nextStatus = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : null
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3"><span className={`rounded-md px-2 py-1 text-[11px] font-bold ${priorityStyles[task.priority]}`}>{priorityLabels[task.priority]}</span><button className="rounded-lg p-1 text-slate-300 hover:bg-slate-50 hover:text-slate-600" aria-label="More actions"><MoreHorizontal size={17} /></button></div>
      <h3 className="mt-4 font-bold leading-5 text-slate-800">{task.title}</h3>
      {task.description && <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">{task.description}</p>}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><CalendarDays size={14} />{task.due_date ? new Date(`${task.due_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}</span>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          {nextStatus && <button onClick={() => onStatusChange(task.id, nextStatus)} className="rounded-lg px-2 py-1 text-[11px] font-bold text-violet-600 hover:bg-violet-50">Move</button>}
          <button onClick={() => onEdit(task)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-violet-600" aria-label="Edit task"><Pencil size={14} /></button>
          <button onClick={() => onDelete(task.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete task"><Trash2 size={14} /></button>
        </div>
      </div>
    </article>
  )
}
