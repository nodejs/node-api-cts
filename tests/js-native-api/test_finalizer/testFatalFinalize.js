// A fatal finalizer aborts the process, so it runs in a spawned child
// (testFatalFinalize_child.mjs) rather than tearing down the test runner.
// Needs the postFinalizer API and the ability to spawn.
if (!experimentalFeatures.postFinalizer || !runtimeFeatures.spawn) {
  skipTest();
}

const result = await spawnTest('testFatalFinalize_child.mjs');

// `aborted` covers however the runtime surfaces the abort (a fatal signal on
// POSIX, one of a few exit codes on Windows); the stderr match is the real
// specificity guard.
assert.ok(result.aborted, `Expected child to abort, got status=${result.status}`);
assert.match(
  result.stderr,
  /Finalizer is calling a function that may affect GC state/,
);
