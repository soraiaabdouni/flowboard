import { buildApp } from './app.js'
import { pool } from './db/connection.js'

const isReadOnlyDemo = process.env.DEMO_READ_ONLY === 'true'
const app = await buildApp(pool, { readOnly: isReadOnlyDemo })

try {
  await pool.query('SELECT 1')

  await app.listen({
    port: Number(process.env.PORT || 3000),
    host: '0.0.0.0'
  })
} catch (error) {
  app.log.error(error)
  await pool.end()
  process.exit(1)
}
