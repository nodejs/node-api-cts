'use strict';
const test_instance_data = loadAddon('test_instance_data');

// Test that instance data can be accessed from a binding.
assert.strictEqual(test_instance_data.increment(), 42);
