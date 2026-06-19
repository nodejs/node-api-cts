if (typeof onUncaughtException !== 'function') {
  throw new Error('Expected a global onUncaughtException function');
}

const expected = new Error('expected uncaught');
onUncaughtException(mustCall((err) => {
  assert.strictEqual(err, expected);
}));

throw expected;
