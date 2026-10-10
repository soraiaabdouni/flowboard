import { X } from 'lucide-react'
import { useState } from 'react'
import { TaskForm } from './TaskForm'

export function TaskModal({ task, onClose, onSubmit }) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (values) => {
    setIsSaving(true)
    setError('')
    try { await onSubmit(values); onClose() } catch (submitError) { setError(submitError.message) } finally { setIsSaving(false) }
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">{task ? 'Edit task' : 'New task'}</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{task ? 'Update task details' : 'Create a new task'}</h2></div><button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close modal"><X size={20} /></button></div>
      <TaskForm key={task?.id || 'new'} task={task} onSubmit={handleSubmit} onCancel={onClose} isSaving={isSaving} error={error} />
    </div>
  </div>
}
