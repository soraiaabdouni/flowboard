import Fastify from 'fastify'
import cors from '@fastify/cors'
import { taskRoutes } from './routes/tasks.js'

export async function buildApp(db, options = {}) {
  const app = Fastify({
    logger: true
  })

  const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(null, false)
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })

  app.get('/', async () => {
    return { message: 'Welcome to FlowBoard API' }
  })

  app.get('/health', async () => {
    return {
      status: 'healthy',
      service: 'flowboard-api'
    }
  })

  const readOnly = options.readOnly ||
    process.env.NODE_ENV === 'production' ||
    process.env.DEMO_READ_ONLY === 'true'

  app.addHook('onRequest', async (request, reply) => {
    const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
    const requestPath = request.url.split('?')[0]
    const isTaskRoute = requestPath === '/tasks' || requestPath.startsWith('/tasks/')

    if (
      readOnly &&
      isTaskRoute &&
      writeMethods.includes(request.method)
    ) {
      return reply.code(403).send({
        error: 'Public demo is read-only'
      })
    }
  })


  await app.register(taskRoutes, { db })

  return app
}
