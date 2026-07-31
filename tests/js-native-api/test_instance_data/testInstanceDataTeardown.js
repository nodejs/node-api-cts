'use strict';

// The delete hook passed to napi_set_instance_data only runs when the
// environment goes away, so observing it takes a child process. This is the
// main-thread environment; testInstanceDataWorker.js covers a secondary one.
if (!runtimeFeatures.spawn) {
  skipTest();
}

const result = await spawnTest('testInstanceDataTeardown_child.mjs');

assert.strictEqual(
  result.status,
  0,
  `child exited with status ${result.status}; stderr:\n${result.stderr}`,
);
assert.strictEqual(
  result.stdout.split(/\r\n?|\n/)[0],
  'deleting addon data',
);
