// An exception thrown from a C finalizer during GC surfaces as an uncaught
// exception on stderr; it runs in a spawned child so the crash doesn't take
// down the test runner. Skipped where the runtime can't spawn (WASM, RN).
if (!runtimeFeatures.spawn) {
  skipTest();
}

const result = await spawnTest('testFinalizerException_child.mjs');
assert.match(result.stderr, /Error during Finalize/);
