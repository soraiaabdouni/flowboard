
import Fastify from 'fastify'

const app = Fastify({
  logger: true
})

app.get('/', async () => {
  return {
    message: 'Welcome to FlowBoard API'
  }
})

app.get('/health', async () => {
  return {
    status: 'healthy',
    service: 'flowboard-api'
  }
})

try {
  await app.listen({
    port: 3000,
    host: '127.0.0.1'
  })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
