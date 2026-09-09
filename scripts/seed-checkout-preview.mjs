#!/usr/bin/env node

/*
 * Explicit catalogue seed step for the isolated guest-checkout preview.
 *
 * This wrapper exists as a second safety boundary around the canonical
 * importer. It refuses production-looking targets and requires explicit
 * preview markers before any catalogue or inventory write is possible.
 */

import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ISOLATED_PROJECT_ID = "abc3d54e-b612-43a8-bf53-7d9cf34eafef";
const PRODUCTION_MEDUSA_HOST = "medusa-server-production-4fc6.up.railway.app";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required environment variable: " + name);
  return value;
}

if (process.env.CHECKOUT_PREVIEW_ONLY !== "true") {
  throw new Error("Refusing to seed without CHECKOUT_PREVIEW_ONLY=true.");
}
if (process.env.CHECKOUT_IMPORT_EXECUTE !== "true") {
  throw new Error("Refusing to seed without explicit CHECKOUT_IMPORT_EXECUTE=true.");
}
if (process.env.CHECKOUT_PREVIEW_PROJECT_ID !== ISOLATED_PROJECT_ID) {
  throw new Error("Refusing to seed an unapproved Railway project.");
}

const backendUrl = new URL(required("MEDUSA_BACKEND_URL").replace(/\/+$/, "") + "/");
const expectedHost = required("CHECKOUT_PREVIEW_BACKEND_HOST");
if (backendUrl.hostname !== expectedHost || backendUrl.hostname === PRODUCTION_MEDUSA_HOST) {
  throw new Error("Refusing to seed: backend host is not the isolated preview host.");
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const child = spawn(
  process.execPath,
  [path.join(root, "scripts", "import-medusa-catalogue-v5.mjs"), "--execute", "--allow-deferred-inventory"],
  {
    cwd: root,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let stderr = "";
child.stdout.on("data", (chunk) => process.stdout.write(chunk));
child.stderr.on("data", (chunk) => {
  stderr += String(chunk);
});
child.on("error", (error) => {
  console.error("Isolated catalogue seed failed to start: " + error.message);
  process.exitCode = 1;
});
child.on("close", (code) => {
  if (code === 0) {
    console.log("Isolated catalogue seed completed.");
    return;
  }
  const detail = stderr.trim().split(/\r?\n/).slice(-1)[0] || "unknown importer error";
  console.error("Isolated catalogue seed stopped: " + detail.slice(0, 300));
  process.exitCode = 1;
});
