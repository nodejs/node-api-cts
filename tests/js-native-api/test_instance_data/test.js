'use strict';

const test_instance_data = loadAddon('test_instance_data');

// The addon seeds its instance data with 41, so seeing 42 here proves the
// binding read back the very data the addon set at init.
assert.strictEqual(test_instance_data.increment(), 42);

// Instance data is reachable from a finalizer too: the JS callback invoked
// below is held in a reference stored in that data.
let finalizerCalled = false;
test_instance_data.objectWithFinalizer(mustCall(() => {
  finalizerCalled = true;
}));

await gcUntil('instance data finalizer', () => finalizerCalled);
