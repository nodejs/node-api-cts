'use strict';

// node_api_post_finalizer and node_api_basic_env are both experimental.
if (!experimentalFeatures.postFinalizer) {
  skipTest();
}

const test_finalizer = loadAddon('test_finalizer');

// The original asserts the finalizer runs in the same tick as GC; the harness
// only exposes async gcUntil, so we settle for observing that it fires.
{
  (() => {
    const obj = {};
    test_finalizer.addFinalizer(obj);
  })();

  await gcUntil(
    'pure finalizer',
    () => test_finalizer.getFinalizerCallCount() === 1,
  );
  assert.strictEqual(test_finalizer.getFinalizerCallCount(), 1);
}

// A finalizer that calls into JS runs later via node_api_post_finalizer, so
// it is observed asynchronously.
{
  let js_is_called = false;
  (() => {
    const obj = {};
    test_finalizer.addFinalizerWithJS(obj, () => {
      js_is_called = true;
    });
  })();

  await gcUntil(
    'JS-calling finalizer',
    () => test_finalizer.getFinalizerCallCount() === 2,
  );
  assert.strictEqual(js_is_called, true);
}
