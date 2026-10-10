export async function taskRoutes(app, { db }) {
  const statuses = ['todo', 'in_progress', 'done']
  const priorities = ['low', 'medium', 'high']
  const datePattern = '^\\d{4}-\\d{2}-\\d{2}$'

  const taskIdParams = {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  }

  const taskFields = {
    title: { type: 'string', maxLength: 150, minLength: 1 },
    description: { type: ['string', 'null'] },
    status: { type: 'string', enum: statuses },
    priority: { type: 'string', enum: priorities },
    due_date: {
      anyOf: [
        { type: 'null' },
        { type: 'string', pattern: datePattern }
      ]
    }
  }

  const createTaskBody = {
    type: 'object',
    required: ['title'],
    additionalProperties: false,
    properties: {
      title: taskFields.title,
      description: taskFields.description,
      status: taskFields.status,
      priority: taskFields.priority,
      due_date: taskFields.due_date
    }
  }

  const updateTaskBody = {
    type: 'object',
    required: ['title', 'description', 'status', 'priority', 'due_date'],
    additionalProperties: false,
    properties: taskFields
  }

  const statusBody = {
    type: 'object',
    required: ['status'],
    additionalProperties: false,
    properties: {
      status: taskFields.status
    }
  }

  const isRealDate = (value) => {
    if (value === null || value === undefined) return true
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))

    return date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
  }

  const validateDates = async (request, reply) => {
    if (request.body?.due_date !== undefined && !isRealDate(request.body.due_date)) {
      return reply.code(400).send({ error: 'due_date must be a valid date in YYYY-MM-DD format' })
    }
  }

  const validateTitle = async (request, reply) => {
    if (request.body?.title !== undefined && request.body.title.trim().length === 0) {
      return reply.code(400).send({ error: 'title must not be blank' })
    }
  }

  const handleDatabaseError = (error, reply) => {
    app.log.error(error)
    return reply.code(500).send({ error: 'Internal server error' })
  }

  app.get('/tasks', async (request, reply) => {
    try {
      const result = await db.query(`
        SELECT id, title, description, status, priority, due_date, created_at
        FROM tasks
        ORDER BY created_at DESC
      `)
      return result.rows
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

  app.get('/tasks/:id', { schema: { params: taskIdParams } }, async (request, reply) => {
    try {
      const result = await db.query(`
        SELECT id, title, description, status, priority, due_date, created_at
        FROM tasks
        WHERE id = $1
      `, [request.params.id])

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Task not found' })
      }

      return result.rows[0]
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

  app.post('/tasks', {
    schema: { body: createTaskBody },
    preValidation: [validateTitle, validateDates]
  }, async (request, reply) => {
    const {
      title,
      description = null,
      status = 'todo',
      priority = 'medium',
      due_date = null
    } = request.body

    try {
      const result = await db.query(`
        INSERT INTO tasks (title, description, status, priority, due_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, description, status, priority, due_date, created_at
      `, [title, description, status, priority, due_date])

      return reply.code(201).send(result.rows[0])
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

  app.put('/tasks/:id', {
    schema: { params: taskIdParams, body: updateTaskBody },
    preValidation: [validateTitle, validateDates]
  }, async (request, reply) => {
    const { title, description, status, priority, due_date } = request.body

    try {
      const result = await db.query(`
        UPDATE tasks
        SET title = $1, description = $2, status = $3, priority = $4, due_date = $5
        WHERE id = $6
        RETURNING id, title, description, status, priority, due_date, created_at
      `, [title, description, status, priority, due_date, request.params.id])

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Task not found' })
      }

      return result.rows[0]
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

  app.patch('/tasks/:id/status', {
    schema: { params: taskIdParams, body: statusBody }
  }, async (request, reply) => {
    try {
      const result = await db.query(`
        UPDATE tasks
        SET status = $1
        WHERE id = $2
        RETURNING id, title, description, status, priority, due_date, created_at
      `, [request.body.status, request.params.id])

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Task not found' })
      }

      return result.rows[0]
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

  app.delete('/tasks/:id', { schema: { params: taskIdParams } }, async (request, reply) => {
    try {
      const result = await db.query(
        'DELETE FROM tasks WHERE id = $1 RETURNING id',
        [request.params.id]
      )

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Task not found' })
      }

      return reply.code(204).send()
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

  app.get('/dashboard/summary', async (request, reply) => {
    try {
      const result = await db.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'todo')::int AS todo,
          COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
          COUNT(*) FILTER (WHERE status = 'done')::int AS done
        FROM tasks
      `)

      return result.rows[0]
    } catch (error) {
      return handleDatabaseError(error, reply)
    }
  })

}