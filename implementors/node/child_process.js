import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const HARNESS_MODULE_PATHS = [
  'features.js',
  'assert.js',
  'load-addon.js',
  'gc.js',
  'must-call.js',
  'skip-test.js',
  'napi-version.js',
  'child_process.js',
].map((file) => path.join(import.meta.dirname, file));

// Exit codes that signify the runtime aborted (rather than exiting cleanly with
// a non-zero status). On POSIX an abort surfaces as a fatal signal; on Windows
// as one of a small set of exit codes. Mirrors Node.js's
// `common.nodeProcessAborted`. The POSIX 128+N codes and the Windows NTSTATUS
// codes share one list because the ranges don't overlap. Keeping this here, in
// the Node implementor, lets portable tests ask "did it abort?" via the
// `aborted` flag without encoding any runtime-specific process semantics.
const ABORT_EXIT_CODES = [132, 133, 134, 139, 0xc0000409, 0xc000001d];

/**
 * Runs a test file in a fresh Node.js subprocess with the CTS harness globals
 * pre-loaded, and returns its exit status, whether it aborted, and output.
 *
 * @param {string} filePath - Path to the JS/MJS file to execute. Resolved
 *   against `options.cwd` if relative.
 * @param {{ cwd?: string }} [options]
 *   - `cwd`: working directory for the child; defaults to `process.cwd()`.
 * @returns {{ status: number | null, aborted: boolean, stdout: string, stderr: string }}
 */
export const spawnTest = (filePath, options = {}) => {
  // --expose-gc is mandatory: gc.js (loaded below) throws at import without it.
  const args = ['--expose-gc'];
  for (const modulePath of HARNESS_MODULE_PATHS) {
    // pathToFileURL handles Windows drive letters and backslashes; a bare
    // 'file://' + path is malformed there (e.g. file://C:\...).
    args.push('--import', pathToFileURL(modulePath).href);
  }
  args.push(filePath);

  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd ?? process.cwd(),
    maxBuffer: 100 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  return {
    status: result.status,
    aborted: result.signal !== null || ABORT_EXIT_CODES.includes(result.status),
    stderr: result.stderr?.toString() ?? '',
    stdout: result.stdout?.toString() ?? '',
  };
};

// This module is loaded in both contexts: imported by the parent test runner
// (tests.ts) and `--import`ed into every spawned child. The side effect below
// installs `spawnTest` on the child's globalThis so tests can call it directly.
Object.assign(globalThis, { spawnTest });
