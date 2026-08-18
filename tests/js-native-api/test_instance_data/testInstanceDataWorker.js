'use strict';

// Upstream's worker variant: the same body in a secondary environment, which
// covers instance data being per-environment and the delete hook running when
// that environment is torn down while the process keeps going. A conformant
// runtime looks the same as the main-thread run, so the value here is in
// exercising the secondary-environment path at all.
if (!runtimeFeatures.spawn || !runtimeFeatures.worker) {
  skipTest();
}

const result = await spawnTest('testInstanceDataWorker_child.mjs', { worker: true });

assert.strictEqual(
  result.status,
  0,
  `child exited with status ${result.status}; stderr:\n${result.stderr}`,
);
assert.strictEqual(
  result.stdout.split(/\r\n?|\n/)[0],
  'deleting addon data',
);
