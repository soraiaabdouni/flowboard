import { useState } from 'react'

const initialValues = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  status: 'todo',
}

function getInitialValues(task) {
  if (!task) return initialValues

  return {
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    due_date: task.due_date || task.dueDate || '',
    status: task.status || 'todo',
  }
}

function isValidDate(value) {
  if (!value) return true

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
}

export function TaskForm({ task, onSubmit, onCancel, isSaving = false, error = '' }) {
  const [values, setValues] = useState(() => getInitialValues(task))
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setValidationErrors((current) => ({ ...current, [name]: '' }))
  }

  const validate = () => {
    const errors = {}
    const title = values.title.trim()

    if (!title) errors.title = 'Title is required.'
    if (title.length > 150) errors.title = 'Title must be 150 characters or fewer.'
    if (!['low', 'medium', 'high'].includes(values.priority)) errors.priority = 'Select a valid priority.'
    if (!isValidDate(values.due_date)) errors.due_date = 'Enter a valid date.'

    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim() || null,
      due_date: values.due_date || null,
    })
  }

  const fieldError = (name) => validationErrors[name]

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

      <div>
        <label htmlFor="task-title" className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
        <input
          id="task-title"
          name="title"
          value={values.title}
          onChange={handleChange}
          maxLength={150}
          autoFocus
          aria-invalid={Boolean(fieldError('title'))}
          aria-describedby={fieldError('title') ? 'task-title-error' : undefined}
          className="field"
          placeholder="e.g. Plan next sprint"
        />
        <div className="mt-1 flex justify-between gap-3">
          {fieldError('title') ? <p id="task-title-error" className="text-xs font-medium text-rose-600">{fieldError('title')}</p> : <span />}
          <span className="text-xs text-slate-400">{values.title.length}/150</span>
        </div>
      </div>

      <div>
        <label htmlFor="task-description" className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
        <textarea id="task-description" name="description" value={values.description} onChange={handleChange} rows="3" className="field resize-none" placeholder="Add a short description..." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="task-priority" className="mb-2 block text-sm font-semibold text-slate-700">Priority</label>
          <select id="task-priority" name="priority" value={values.priority} onChange={handleChange} aria-invalid={Boolean(fieldError('priority'))} className="field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {fieldError('priority') && <p className="mt-1 text-xs font-medium text-rose-600">{fieldError('priority')}</p>}
        </div>

        <div>
          <label htmlFor="task-due-date" className="mb-2 block text-sm font-semibold text-slate-700">Due date <span className="font-normal text-slate-400">(optional)</span></label>
          <input id="task-due-date" type="date" name="due_date" value={values.due_date} onChange={handleChange} aria-invalid={Boolean(fieldError('due_date'))} className="field" />
          {fieldError('due_date') && <p className="mt-1 text-xs font-medium text-rose-600">{fieldError('due_date')}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onCancel} className="button-secondary">Cancel</button>
        <button type="submit" disabled={isSaving} className="button-primary disabled:cursor-not-allowed disabled:opacity-60">
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
