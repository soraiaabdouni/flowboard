import { TaskCard } from './TaskCard'

const columns = [
  { status: 'todo', title: 'To do', color: 'bg-slate-400' },
  { status: 'in_progress', title: 'In progress', color: 'bg-violet-500' },
  { status: 'done', title: 'Done', color: 'bg-emerald-500' },
]

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status)

        return (
          <section key={column.status} className="min-w-0">
            <div className="mb-4 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
              <h2 className="text-sm font-bold text-slate-700">{column.title}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-400">
                {columnTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {columnTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center text-sm text-slate-400">
                  No tasks in this column.
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
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
