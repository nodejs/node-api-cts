'use strict';

// Running a test file in a secondary environment (a worker) is an optional
// harness capability, declared separately from `spawn` because a runtime can
// have one without the other: a browser has workers but no subprocesses.
//
// The Node harness delivers it as an option on spawnTest rather than as its own
// global, because observing a secondary environment's *native* output requires
// capturing the stdout of the process hosting it - a worker's own piped stdout
// carries JS-level writes only, so a printf from an addon bypasses it.
assert.strictEqual(
  typeof runtimeFeatures.worker,
  'boolean',
  'Expected runtimeFeatures.worker to be a boolean',
);
if (!runtimeFeatures.spawn || !runtimeFeatures.worker) {
  skipTest();
}

// That the file ran in a secondary environment rather than the main one is not
// observable from portable ECMAScript; proving that needs per-environment
// Node-API state (see the test_instance_data suite). What is pinned here is the
// plumbing: the file runs, harness globals reach it, and a failure inside the
// worker still surfaces as a non-zero status with its stderr intact instead of
// being swallowed by the host thread.
{
  const result = await spawnTest('spawn-test-ok-child.mjs', { worker: true });
  assert.strictEqual(result.status, 0, `ok child exited with status ${result.status}; stderr:\n${result.stderr}`);
  assert.strictEqual(result.aborted, false);
  assert.strictEqual(result.stderr, '');
}

{
  const result = await spawnTest('spawn-test-fail-child.mjs', { worker: true });
  assert.notStrictEqual(result.status, 0, 'fail child should exit non-zero');
  assert.strictEqual(result.aborted, false);
  if (!result.stderr.includes('spawn-test-fail-marker')) {
    throw new Error(`Expected stderr to include the failure marker, got:\n${result.stderr}`);
  }
}

// cwd still applies in worker mode: the test file is resolved against it, so an
// unresolvable filename must fail loudly rather than pass as an empty worker.
{
  const result = await spawnTest('spawn-test-ok-child.mjs', { worker: true, cwd: '..' });
  assert.notStrictEqual(result.status, 0, 'expected cwd ".." to make the child filename unresolvable');
  if (!result.stderr.includes('spawn-test-ok-child.mjs')) {
    throw new Error(`Expected stderr to reference the unresolved child filename, got:\n${result.stderr}`);
  }
}
