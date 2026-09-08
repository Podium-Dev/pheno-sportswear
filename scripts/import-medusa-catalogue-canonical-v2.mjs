#!/usr/bin/env node

/* Canonical dry-run/import runner for the Medusa 2.20.1 compatibility revision. */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "scripts", "import-medusa-catalogue-v5.mjs");
let source = fs.readFileSync(sourcePath, "utf8");
const replacements = [
  ["function payloadContractReport(actions, productPlans, relation) {", "function payloadContractReport(catalogue, actions, productPlans, relation) {"],
  ["        null,\n        updateAction,", "        catalogue,\n        updateAction,"],
  ["payloadContractReport(actions, productPlans, relation)", "payloadContractReport(catalogue, actions, productPlans, relation)"],
  ["const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), \"..\");", "const ROOT = " + JSON.stringify(root) + ";"],
];
for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error("Canonical importer source pattern not found.");
  source = source.replace(before, after);
}

const child = spawn(process.execPath, ["--input-type=module", "-", ...process.argv.slice(2)], {
  cwd: root,
  env: process.env,
  stdio: ["pipe", "inherit", "inherit"],
});
child.stdin.end(source);
child.on("error", (error) => {
  console.error("Canonical importer launcher stopped: " + error.message);
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});
