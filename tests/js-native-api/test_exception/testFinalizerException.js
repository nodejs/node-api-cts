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

let finalized = false;
onUncaughtException(mustCall((err) => {
  assert.match(err.message, /Error during Finalize/);
  finalized = true;
}));

(async function() {
  binding.createExternal();
  await gcUntil('finalizer throws', () => finalized);
})().then(mustCall());
