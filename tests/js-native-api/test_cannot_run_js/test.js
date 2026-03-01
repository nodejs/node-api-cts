// Test that `napi_get_named_property()` returns `napi_cannot_run_js` in
// experimental mode and `napi_pending_exception` otherwise. This test calls
// the add-on's `createRef()` method, which creates a strong reference to a JS
// function. When the process exits, it calls all reference finalizers. The
// finalizer for the strong reference created herein will attempt to call
// `napi_get_property()` on a property of the global object and will abort the
// process if the API doesn't return the correct status.

const addon_v8 = loadAddon('test_pending_exception');
const addon_new = loadAddon('test_cannot_run_js');

function runTests(addon) {
  addon.createRef(function() { throw new Error('function should not have been called'); });
}

function runAllTests() {
  runTests(addon_v8);
  runTests(addon_new);
}

runAllTests();
