const API_URL =
  (import.meta.env.VITE_API_URL || 'http://localhost:3000')
    .replace(/\/$/, '')

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })

  if (!response.ok) {
    let message = `Request failed: ${response.status}`

    try {
      const body = await response.json()
      if (body.error) message = body.error
    } catch {
      // Keep the status-based message when the server has no JSON error body.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const taskService = {
  getAll: () => request('/tasks'),

  getById: (id) => request(`/tasks/${id}`),

  create: (task) => request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  }),

  update: (id, task) => request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  }),

  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  delete: (id) => request(`/tasks/${id}`, {
    method: 'DELETE'
  }),

  getSummary: () => request('/dashboard/summary')
}
