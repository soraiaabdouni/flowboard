import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp } from '../src/app.js'

const taskId = '11111111-1111-4111-8111-111111111111'
const missingTaskId = '22222222-2222-4222-8222-222222222222'

function createFakeDb(initialTasks = []) {
  const tasks = new Map(initialTasks.map((task) => [task.id, { ...task }]))

  return {
    async query(sql, params = []) {
      const query = sql.replace(/\s+/g, ' ').trim()

      if (query.startsWith('SELECT id, title') && query.includes('ORDER BY')) {
        return { rows: [...tasks.values()], rowCount: tasks.size }
      }

      if (query.startsWith('SELECT id, title') && query.includes('WHERE id = $1')) {
        const task = tasks.get(params[0])
        return { rows: task ? [{ ...task }] : [], rowCount: task ? 1 : 0 }
      }

      if (query.startsWith('INSERT INTO tasks')) {
        const task = {
          id: taskId,
          title: params[0],
          description: params[1],
          status: params[2],
          priority: params[3],
          due_date: params[4],
          created_at: '2026-10-10T03:00:00.000Z'
        }
        tasks.set(task.id, task)
        return { rows: [task], rowCount: 1 }
      }

      if (query.startsWith('UPDATE tasks SET title')) {
        const task = tasks.get(params[5])
        if (!task) return { rows: [], rowCount: 0 }

        Object.assign(task, {
          title: params[0],
          description: params[1],
          status: params[2],
          priority: params[3],
          due_date: params[4]
        })
        return { rows: [task], rowCount: 1 }
      }

      if (query.startsWith('UPDATE tasks SET status')) {
        const task = tasks.get(params[1])
        if (!task) return { rows: [], rowCount: 0 }

        task.status = params[0]
        return { rows: [task], rowCount: 1 }
      }

      if (query.startsWith('DELETE FROM tasks')) {
        const task = tasks.get(params[0])
        if (!task) return { rows: [], rowCount: 0 }

        tasks.delete(params[0])
        return { rows: [{ id: params[0] }], rowCount: 1 }
      }

      if (query.startsWith('SELECT COUNT(*)')) {
        const summary = [...tasks.values()].reduce((result, task) => {
          result.total += 1
          result[task.status] += 1
          return result
        }, { total: 0, todo: 0, in_progress: 0, done: 0 })

        return { rows: [summary], rowCount: 1 }
      }

      throw new Error(`Unexpected query: ${query}`)
    }
  }
}

function makeTask(overrides = {}) {
  return {
    id: taskId,
    title: 'Tarefa inicial',
    description: 'Descrição inicial',
    status: 'todo',
    priority: 'medium',
    due_date: '2026-12-31',
    created_at: '2026-10-10T03:00:00.000Z',
    ...overrides
  }
}

async function withApp(callback, initialTasks = []) {
  const app = await buildApp(createFakeDb(initialTasks))

  try {
    await callback(app)
  } finally {
    await app.close()
  }
}

test('GET /health returns 200', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.json().status, 'healthy')
  })
})

test('GET /tasks returns an empty array', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks'
    })

    assert.equal(response.statusCode, 200)
    assert.deepEqual(response.json(), [])
  })
})

test('POST /tasks requires a title', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        priority: 'high'
      }
    })

    assert.equal(response.statusCode, 400)
  })
})

test('POST /tasks creates a valid task', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        title: 'Planejar sprint',
        description: 'Definir as tarefas da próxima sprint',
        priority: 'high',
        due_date: '2026-11-15'
      }
    })

    assert.equal(response.statusCode, 201)
    assert.deepEqual(response.json(), {
      id: taskId,
      title: 'Planejar sprint',
      description: 'Definir as tarefas da próxima sprint',
      status: 'todo',
      priority: 'high',
      due_date: '2026-11-15',
      created_at: '2026-10-10T03:00:00.000Z'
    })
  })
})

test('POST /tasks rejects an empty or whitespace-only title', async () => {
  await withApp(async (app) => {
    for (const title of ['', '   ']) {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: { title }
      })

      assert.equal(response.statusCode, 400)
    }
  })
})

test('POST /tasks rejects an invalid priority', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        title: 'Tarefa inválida',
        priority: 'urgent'
      }
    })

    assert.equal(response.statusCode, 400)
  })
})

test('POST /tasks rejects a nonexistent date', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        title: 'Data inválida',
        due_date: '2026-02-30'
      }
    })

    assert.equal(response.statusCode, 400)
  })
})

test('GET /tasks/:id returns 404 for an unknown UUID', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'GET',
      url: `/tasks/${missingTaskId}`
    })

    assert.equal(response.statusCode, 404)
    assert.deepEqual(response.json(), { error: 'Task not found' })
  })
})

test('PUT /tasks/:id updates a task', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'PUT',
      url: `/tasks/${taskId}`,
      payload: {
        title: 'Tarefa atualizada',
        description: 'Descrição atualizada',
        status: 'in_progress',
        priority: 'low',
        due_date: '2026-12-01'
      }
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.json().title, 'Tarefa atualizada')
    assert.equal(response.json().status, 'in_progress')
    assert.equal(response.json().priority, 'low')
  }, [makeTask()])
})

test('PATCH /tasks/:id/status changes a task status', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${taskId}/status`,
      payload: { status: 'done' }
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.json().status, 'done')
  }, [makeTask()])
})

test('DELETE /tasks/:id deletes an existing task', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/tasks/${taskId}`
    })

    assert.equal(response.statusCode, 204)
    assert.equal(response.body, '')
  }, [makeTask()])
})

test('GET /dashboard/summary returns task statistics', async () => {
  await withApp(async (app) => {
    const response = await app.inject({
      method: 'GET',
      url: '/dashboard/summary'
    })

    assert.equal(response.statusCode, 200)
    assert.deepEqual(response.json(), {
      total: 3,
      todo: 1,
      in_progress: 1,
      done: 1
    })
  }, [
    makeTask(),
    makeTask({
      id: '33333333-3333-4333-8333-333333333333',
      status: 'in_progress'
    }),
    makeTask({
      id: '44444444-4444-4444-8444-444444444444',
      status: 'done'
    })
  ])
})
