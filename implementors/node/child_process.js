import { spawnSync } from "node:child_process";
import path from "node:path";

const HARNESS_MODULE_PATHS = [
  "features.js",
  "assert.js",
  "load-addon.js",
  "gc.js",
  "must-call.js",
  "skip-test.js",
  "napi-version.js",
  "child_process.js",
].map((file) => path.join(import.meta.dirname, file));

/**
 * Runs a test file in a fresh Node.js subprocess with the CTS harness globals
 * pre-loaded, and returns its exit status, signal, and captured output.
 *
 * @param {string} filePath - Path to the JS/MJS file to execute. Resolved
 *   against `options.cwd` if relative.
 * @param {{ cwd?: string }} [options]
 *   - `cwd`: working directory for the child; defaults to `process.cwd()`.
 * @returns {{ status: number | null, signal: NodeJS.Signals | null, stdout: string, stderr: string }}
 */
export const spawnTest = (filePath, options = {}) => {
  // --expose-gc is mandatory: gc.js (loaded below) throws at import without it.
  const args = ["--expose-gc"];
  for (const modulePath of HARNESS_MODULE_PATHS) {
    args.push("--import", "file://" + modulePath);
  }
  args.push(filePath);

  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd ?? process.cwd(),
    maxBuffer: 100 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  return {
    status: result.status,
    signal: result.signal,
    stderr: result.stderr?.toString() ?? "",
    stdout: result.stdout?.toString() ?? "",
  };
};

// This module is loaded in both contexts: imported by the parent test runner
// (tests.ts) and `--import`ed into every spawned child. The side effect below
// installs `spawnTest` on the child's globalThis so tests can call it directly.
Object.assign(globalThis, { spawnTest });
