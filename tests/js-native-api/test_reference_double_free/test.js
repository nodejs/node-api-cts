'use strict';

// This test makes no assertions. It tests a fix without which it will crash
// with a double free.

const addon = loadAddon('test_reference_double_free');

{ new addon.MyObject(true); }
{ new addon.MyObject(false); }
