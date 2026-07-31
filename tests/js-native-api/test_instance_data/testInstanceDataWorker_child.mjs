// Child of testInstanceDataWorker.js, run in a worker: a secondary Node-API
// environment. Runs the same body as test.js does on the main thread, since
// that is what the secondary environment has to reproduce.

const test_instance_data = loadAddon('test_instance_data');

// Instance data is per-environment, so it is seeded at 41 here as well rather
// than continuing from another environment's count.
assert.strictEqual(test_instance_data.increment(), 42);

let finalizerCalled = false;
test_instance_data.objectWithFinalizer(mustCall(() => {
  finalizerCalled = true;
}));

await gcUntil('instance data finalizer in worker', () => finalizerCalled);

// Arm the delete hook so it prints when this environment - not the whole
// process - is torn down.
test_instance_data.setPrintOnDelete();
