"use strict";
// Flags: --expose-gc --force-node-api-uncaught-exceptions-policy

const binding = loadAddon("test_finalizer");

onUncaughtException(
  mustCall((err) => {
    assert.throws(() => {
      throw err;
    }, /finalizer error/);
  }),
);

(async function () {
  {
    binding.createExternalWithJsFinalize(
      mustCall(() => {
        throw new Error("finalizer error");
      }),
    );
  }
  let gcCount = 1;
  await gcUntil("test", () => gcCount-- > 0);
})().then(mustCall());
