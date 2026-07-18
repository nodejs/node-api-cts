// A C finalizer that throws during GC surfaces as an uncaught exception. This
// mirrors test_reference/test_finalizer.js, except the addon here throws from
// Init; its exports are still reachable via the error's `.binding`, so a
// finalizer can be installed even though initialization failed.
const binding = (function() {
  let resultingException;
  try {
    loadAddon('test_exception');
  } catch (anException) {
    resultingException = anException;
  }
  assert.strictEqual(resultingException.message, 'Error during Init');
  return resultingException.binding;
})();

onUncaughtException(mustCall((err) => {
  assert.match(err.message, /Error during Finalize/);
}));

(async function() {
  binding.createExternal();

  // GC until the finalizer fires; the counter just bounds the loop.
  let gcCount = 10;
  await gcUntil('test', () => --gcCount <= 0);
})().then(mustCall());
