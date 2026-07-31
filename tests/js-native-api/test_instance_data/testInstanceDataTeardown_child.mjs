// Child of testInstanceDataTeardown.js: arms the addon to print from its
// instance-data delete hook, then exits so the hook runs at environment
// teardown and the parent can read the line off stdout.
const test_instance_data = loadAddon('test_instance_data');

test_instance_data.setPrintOnDelete();
