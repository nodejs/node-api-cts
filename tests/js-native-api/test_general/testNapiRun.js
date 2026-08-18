const test_general = loadAddon('test_general');

assert.strictEqual(test_general.testNapiRun('(41.92 + 0.08);'), 42);
assert.throws(
  () => test_general.testNapiRun({ abc: 'def' }),
  /string was expected/,
);
