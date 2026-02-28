'use strict';

// This test makes no assertions. It tests that calling napi_remove_wrap and
// napi_delete_reference consecutively doesn't crash the process.

const addon = loadAddon('test_reference_double_free');

addon.deleteImmediately({});
