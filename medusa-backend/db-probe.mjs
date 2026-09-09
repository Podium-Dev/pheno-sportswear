import { Client } from "pg"

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 8000,
  query_timeout: 8000,
})

try {
  await client.connect()
  await client.query("SELECT 1 AS connectivity_test")
  console.log("[PROBE_PASS] PostgreSQL SELECT 1 succeeded")
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
