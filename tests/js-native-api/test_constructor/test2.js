// Testing api calls for a constructor that defines properties
const TestConstructor = loadAddon('test_constructor').constructorName;
assert.strictEqual(TestConstructor.name, 'MyObject');
