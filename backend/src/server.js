import { buildApp } from './app.js'
import { pool } from './db/connection.js'

const app = await buildApp(pool)

try {
  await pool.query('SELECT 1')

  await app.listen({
    port: Number(process.env.PORT || 3000),
    host: '127.0.0.1'
  })
} catch (error) {
  app.log.error(error)
  await pool.end()
  process.exit(1)
}
