// node_api_create_object_with_properties is gated behind NAPI_EXPERIMENTAL, so
// it lives in its own addon and the stable test_object addon stays loadable
// everywhere.
if (!experimentalFeatures.createObjectWithProperties) {
  skipTest();
}

const addon = loadAddon('test_object_create_with_properties');

{
  // A null prototype plus three properties of differing types.
  const objectWithProperties = addon.TestCreateObjectWithProperties();

  assert.strictEqual(typeof objectWithProperties, 'object');
  assert.strictEqual(Object.getPrototypeOf(objectWithProperties), null);
  assert.strictEqual(objectWithProperties.name, 'Foo');
  assert.strictEqual(objectWithProperties.age, 42);
  assert.strictEqual(objectWithProperties.active, true);
}

{
  // Zero properties and a NULL prototype argument.
  const emptyObject = addon.TestCreateObjectWithPropertiesEmpty();

  assert.strictEqual(typeof emptyObject, 'object');
  assert.strictEqual(Object.keys(emptyObject).length, 0);
}

{
  // A supplied prototype contributes its members without becoming own
  // properties.
  const objectWithCustomPrototype = addon.TestCreateObjectWithCustomPrototype();

  assert.strictEqual(typeof objectWithCustomPrototype, 'object');
  assert.deepStrictEqual(
    Object.getOwnPropertyNames(objectWithCustomPrototype),
    ['value'],
  );
  assert.strictEqual(objectWithCustomPrototype.value, 42);
  assert.strictEqual(typeof objectWithCustomPrototype.test, 'function');
}
