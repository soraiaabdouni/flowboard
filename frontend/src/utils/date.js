export function toDateInputValue(value) {
  if (!value) return ''

  const normalizedValue = String(value).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue) ? normalizedValue : ''
}

export function formatTaskDueDate(value) {
  const dateValue = toDateInputValue(value)
  if (!dateValue) return 'No due date'

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
