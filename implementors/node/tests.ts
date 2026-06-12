import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import { spawnTest } from './child_process.js';

assert(
  typeof import.meta.dirname === 'string',
  'Expecting a recent Node.js runtime API version',
);

const ROOT_PATH = path.resolve(import.meta.dirname, '..', '..');
const TESTS_ROOT_PATH = path.join(ROOT_PATH, 'tests');

export function listDirectoryEntries(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const directories: string[] = [];
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push(entry.name);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(entry.name);
    }
  }

  directories.sort();
  files.sort();

  return { directories, files };
}

export function runFileInSubprocess(cwd: string, filePath: string): void {
  const { status, aborted, stdout, stderr } = spawnTest(filePath, { cwd });

  if (stdout) process.stdout.write(stdout);

  if (status === 0) return;

  const reason =
    status !== null ? `exit code ${status}` : aborted ? 'aborted' : 'unknown';
  const trimmedStderr = stderr.trim();
  const stderrSuffix = trimmedStderr ?
    `\n--- stderr ---\n${trimmedStderr}\n--- end stderr ---` :
    '';
  throw new Error(
    `Test file ${path.relative(
      TESTS_ROOT_PATH,
      path.join(cwd, filePath),
    )} failed (${reason})${stderrSuffix}`,
  );
}
