// node_api_set_prototype is gated behind NAPI_EXPERIMENTAL, so it lives in its
// own addon and the stable test_general addon stays loadable everywhere.
if (!experimentalFeatures.setPrototype) {
  skipTest();
}

const test_general = loadAddon('test_general');
const test_general_set_prototype = loadAddon('test_general_set_prototype');

const nullProtoObject = { __proto__: null };
assert.strictEqual(Object.getPrototypeOf(nullProtoObject), null);

test_general_set_prototype.testSetPrototype(nullProtoObject, Object.prototype);

assert.strictEqual(Object.getPrototypeOf(nullProtoObject), Object.prototype);
// napi_get_prototype must agree with the prototype just installed.
assert.strictEqual(
  test_general.testGetPrototype(nullProtoObject),
  Object.prototype,
);
