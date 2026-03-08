'use strict';

// This test verifies that ObjectWrap can be correctly finalized with a
// node_api_basic_finalizer in the current JS loop tick. The addon is compiled
// with NAPI_EXPERIMENTAL, so guard behind the postFinalizer feature flag.
if (experimentalFeatures.postFinalizer) {
  const addon = loadAddon('myobject_basic_finalizer');

  (() => {
    let obj = new addon.MyObject(9);
    obj = null;
    // Silent eslint about unused variables.
    assert.strictEqual(obj, null);
  })();

  await gcUntil('basic-finalizer', () => addon.getFinalizerCallCount() === 1);
}
