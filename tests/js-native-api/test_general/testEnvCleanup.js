// Wrap finalizers that survive until the environment is torn down only run as
// the environment goes away, so this needs a child process to observe.
if (!runtimeFeatures.spawn) {
  skipTest();
}

const result = await spawnTest('testEnvCleanup_child.mjs');

assert.strictEqual(
  result.status,
  0,
  `child exited with status ${result.status}; stderr:\n${result.stderr}`,
);

// The child wraps three objects and keeps them alive to teardown. Only two
// finalizers should fire: the plain wrap, and the second of the re-wrapped
// pair. The removed wrap must not report, and neither must the first wrap that
// was replaced. Order between the two is unspecified, so compare as a set.
const reported = result.stdout.split(/\r\n|\r|\n/).filter(Boolean).sort();

assert.deepStrictEqual(reported, [
  'finalize at env cleanup for second wrap',
  'finalize at env cleanup for simple wrap',
]);
