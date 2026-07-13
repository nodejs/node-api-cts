import { spawn } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// A single module that imports every harness global (including this one, so
// spawned children can recursively call spawnTest). Consolidating the harness
// into one --import keeps the child's command line short.
const HARNESS_MODULE_PATH = path.join(import.meta.dirname, 'harness.js');

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
 * @param {{ cwd?: string, stdout?: 'pipe' | 'inherit' }} [options]
 *   - `cwd`: working directory for the child; defaults to `process.cwd()`.
 *   - `stdout`: `'pipe'` (default) captures the child's stdout into the result;
 *     `'inherit'` streams it straight to the terminal as the child runs (so the
 *     output of a slow or hanging test is visible immediately) and leaves the
 *     returned `stdout` empty. stderr is always captured for diagnostics.
 * @returns {Promise<{ status: number | null, aborted: boolean, stdout: string, stderr: string }>}
 */
export const spawnTest = (filePath, options = {}) => {
  // --expose-gc is mandatory: gc.js (loaded via harness.js) throws at import
  // without it.
  // pathToFileURL handles Windows drive letters and backslashes; a bare
  // 'file://' + path is malformed there (e.g. file://C:\...).
  const args = [
    '--expose-gc',
    '--import',
    pathToFileURL(HARNESS_MODULE_PATH).href,
    filePath,
  ];

  // spawn (not spawnSync) so a hung child doesn't block the event loop and the
  // test runner can still enforce its per-test timeout.
  const child = spawn(process.execPath, args, {
    cwd: options.cwd ?? process.cwd(),
    stdio: ['ignore', options.stdout ?? 'pipe', 'pipe'],
  });

  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    // child.stdout is null when stdout is 'inherit' (streamed to the terminal).
    child.stdout?.setEncoding('utf8').on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.setEncoding('utf8').on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    // 'close' (not 'exit') fires once the stdio streams have drained, so stdout
    // and stderr are complete.
    child.on('close', (status, signal) => {
      resolve({
        status,
        aborted: signal !== null || ABORT_EXIT_CODES.includes(status),
        stderr,
        stdout,
      });
    });
  });
};

// This module is loaded in both contexts: imported by the parent test runner
// (tests.ts) and `--import`ed into every spawned child. The side effect below
// installs `spawnTest` on the child's globalThis so tests can call it directly.
Object.assign(globalThis, { spawnTest });
