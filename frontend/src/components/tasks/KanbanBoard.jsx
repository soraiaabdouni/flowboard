import { CircleCheck, CircleDashed, Clock3 } from 'lucide-react'
import { TaskCard } from './TaskCard'

const columns = [
  { status: 'todo', title: 'To do', description: 'Ready to get started', color: 'bg-slate-400', tint: 'bg-slate-50 text-slate-600', icon: CircleDashed },
  { status: 'in_progress', title: 'In progress', description: 'Work currently underway', color: 'bg-violet-500', tint: 'bg-violet-50 text-violet-700', icon: Clock3 },
  { status: 'done', title: 'Done', description: 'Completed work', color: 'bg-emerald-500', tint: 'bg-emerald-50 text-emerald-700', icon: CircleCheck },
]

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange, readOnly = false }) {
  return (
    <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status)
        const ColumnIcon = column.icon

        return (
          <section key={column.status} className="min-w-0 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3 shadow-sm shadow-slate-200/40 sm:p-4">
            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className={`rounded-xl p-2 ${column.tint}`}>
                  <ColumnIcon size={17} strokeWidth={2.2} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-800">{column.title}</h2>
                  <p className="mt-1 truncate text-xs font-medium text-slate-400">{column.description}</p>
                </div>
              </div>
              <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200/80" aria-label={`${columnTasks.length} tasks`}>
                {columnTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-6 py-8 text-center">
                  <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
                    <ColumnIcon size={20} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">No tasks here</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">Tasks added to this stage will appear here.</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    readOnly={readOnly}
                  />
                ))
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
