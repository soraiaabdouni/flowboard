import Fastify from 'fastify'
import cors from '@fastify/cors'
import { taskRoutes } from './routes/tasks.js'

export async function buildApp(db) {
  const app = Fastify({
    logger: true
  })

  await app.register(cors, {
    origin: 'http://localhost:5173',
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

  await app.register(taskRoutes, { db })

  return app
}
