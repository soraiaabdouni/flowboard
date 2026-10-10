import { pool } from './connection.js'

try {
  const result = await pool.query(
    'SELECT NOW() AS server_time'
  )

  console.log('Database connected successfully!')
  console.log(result.rows[0])
} catch (error) {
  console.error('Database connection failed:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
