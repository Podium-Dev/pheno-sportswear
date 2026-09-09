import { Client } from "pg"

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 8000,
  query_timeout: 8000,
})

try {
  await client.connect()
  await client.query("SELECT 1 AS connectivity_test")
  const activity = await client.query(`
    SELECT
      count(*)::int AS sessions,
      count(*) FILTER (WHERE state = 'active')::int AS active_sessions,
      count(*) FILTER (WHERE wait_event IS NOT NULL)::int AS waiting_sessions
    FROM pg_stat_activity
    WHERE datname = current_database() AND pid <> pg_backend_pid()
  `)
  const locks = await client.query(`
    SELECT
      count(*) FILTER (WHERE granted)::int AS granted_locks,
      count(*) FILTER (WHERE NOT granted)::int AS waiting_locks
    FROM pg_locks
    WHERE database = (SELECT oid FROM pg_database WHERE datname = current_database())
  `)
  console.log("[PROBE_PASS] PostgreSQL SELECT 1 succeeded")
  console.log("[PROBE_ACTIVITY] " + JSON.stringify(activity.rows[0]))
  console.log("[PROBE_LOCKS] " + JSON.stringify(locks.rows[0]))
} catch (error) {
  const code = error?.code || "unknown"
  const message = String(error?.message || error)
    .replace(/postgres(ql)?:\\/\\/[^\\s]+/gi, "[redacted-url]")
    .replace(/password=[^&\\s]+/gi, "password=[redacted]")
  console.error("[PROBE_FAIL] PostgreSQL query failed code=" + code + " message=" + message)
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
