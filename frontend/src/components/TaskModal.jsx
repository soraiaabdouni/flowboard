import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { TaskForm } from './TaskForm'

export function TaskModal({ task, onClose, onSubmit }) {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const isSavingRef = useRef(isSaving)
  const previousFocusRef = useRef(document.activeElement)
  const titleId = 'task-modal-title'
  const descriptionId = 'task-modal-description'

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    isSavingRef.current = isSaving
  }, [isSaving])

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousFocus = previousFocusRef.current
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSavingRef.current) {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [])
  const handleSubmit = async (values) => {
    setIsSaving(true)
    setError('')
    try { await onSubmit(values); onClose() } catch (submitError) { setError(submitError.message) } finally { setIsSaving(false) }
  }

  return <div className="motion-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
    <div ref={dialogRef} className="motion-modal-panel max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:max-h-[90vh] sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">{task ? 'Edit task' : 'New task'}</p><h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{task ? 'Update task details' : 'Create a new task'}</h2><p id={descriptionId} className="mt-2 text-sm text-slate-500">Complete the fields below and save your task.</p></div><button ref={closeButtonRef} onClick={onClose} disabled={isSaving} className="shrink-0 rounded-xl p-2 text-slate-400 transition duration-200 ease-out hover:bg-slate-100 hover:text-slate-700 active:scale-95 focus-visible:ring-4 focus-visible:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close modal"><X size={20} aria-hidden="true" /></button></div>
      <TaskForm key={task?.id || 'new'} task={task} onSubmit={handleSubmit} onCancel={onClose} isSaving={isSaving} error={error} />
    </div>
  </div>
}
