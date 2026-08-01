// Flags: --expose-gc --force-node-api-uncaught-exceptions-policy

const binding = loadAddon('test_finalizer');

onUncaughtException(
  mustCall((err) => {
    assert.throws(() => {
      throw err;
    }, /finalizer error/);
  }),
);

(async function() {
  {
    binding.createExternalWithJsFinalize(
      mustCall(() => {
        throw new Error('finalizer error');
      }),
    );
  }
  gc();
})().then(mustCall());
