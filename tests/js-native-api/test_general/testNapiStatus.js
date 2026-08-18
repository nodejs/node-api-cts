const test_general = loadAddon('test_general');

// createNapiError provokes a failing call, then checks that
// napi_get_last_error_info reports that failure. The next successful call must
// reset the recorded status back to napi_ok.
test_general.createNapiError();
assert.ok(
  test_general.testNapiErrorCleanup(),
  'napi_status cleaned up for second call',
);
