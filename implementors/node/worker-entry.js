import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Worker } from 'node:worker_threads';

// Entry point for spawnTest(file, { worker: true }): boots the test file in a
// worker thread, giving it a secondary Node-API environment inside this process.
//
// The worker inherits this process's execArgv, so the harness --import applies
// there too and the test file sees the same globals as on the main thread.
//
// No 'error' handler is installed on purpose: an unhandled worker error is
// re-thrown on this thread, so a failing test file still exits the process
// non-zero with its stack on stderr, exactly as it would on the main thread.
const [filePath] = process.argv.slice(2);

// Worker resolves a relative specifier against the cwd, but a bare filename
// (no leading './') would read as a package specifier - so make it absolute.
new Worker(pathToFileURL(path.resolve(filePath)));
