'use strict';
const addon = loadAddon('nested_wrap');

// This test verifies that ObjectWrap and napi_ref can be nested and finalized
// correctly with a non-basic finalizer.
(() => {
  let obj = new addon.NestedWrap();
  obj = null;
  // Silent eslint about unused variables.
  assert.strictEqual(obj, null);
})();

await gcUntil('object-wrap-ref', () => {
  return addon.getFinalizerCallCount() === 1;
});
