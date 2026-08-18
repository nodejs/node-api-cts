const test_general = loadAddon('test_general');

const val1 = '1';
const val2 = 1;
const val3 = 1;

class BaseClass {
}

class ExtendedClass extends BaseClass {
}

const baseObject = new BaseClass();
const extendedObject = new ExtendedClass();

// napi_strict_equals
assert.ok(test_general.testStrictEquals(val1, val1));
assert.strictEqual(test_general.testStrictEquals(val1, val2), false);
assert.ok(test_general.testStrictEquals(val2, val3));

// napi_get_prototype
assert.strictEqual(
  test_general.testGetPrototype(baseObject),
  Object.getPrototypeOf(baseObject),
);
assert.strictEqual(
  test_general.testGetPrototype(extendedObject),
  Object.getPrototypeOf(extendedObject),
);
// Prototypes for base and extended should be different.
assert.notStrictEqual(
  test_general.testGetPrototype(baseObject),
  test_general.testGetPrototype(extendedObject),
);

// napi_get_version. Upstream pins this to Node.js's own Node-API version;
// portably, the addon must report whatever version the runtime declares.
assert.strictEqual(test_general.testGetVersion(), napiVersion);

// napi_typeof
[
  123,
  'test string',
  function() {},
  new Object(),
  true,
  undefined,
  Symbol(),
].forEach((val) => {
  assert.strictEqual(test_general.testNapiTypeof(val), typeof val);
});

// typeof null is 'object' in JS, so napi_null gets its own case.
assert.strictEqual(test_general.testNapiTypeof(null), 'null');

// Wrapping the same object twice fails.
const x = {};
test_general.wrap(x);
assert.throws(
  () => test_general.wrap(x),
  { name: 'Error', message: 'Invalid argument' },
);
// Clean up here, otherwise derefItemWasCalled() will be polluted.
test_general.removeWrap(x);

// Wrapping twice succeeds if a removeWrap() separates the instances.
const y = {};
test_general.wrap(y);
test_general.removeWrap(y);
test_general.wrap(y);
// Clean up here, otherwise derefItemWasCalled() will be polluted.
test_general.removeWrap(y);

// napi_adjust_external_memory
const adjustedValue = test_general.testAdjustExternalMemory();
assert.strictEqual(typeof adjustedValue, 'number');
assert.ok(adjustedValue > 0);

// Garbage collecting a wrapped object calls the finalizer.
assert.strictEqual(test_general.derefItemWasCalled(), false);

(() => test_general.wrap({}))();
await gcUntil(
  'deref_item() was called upon garbage collecting a wrapped object.',
  () => test_general.derefItemWasCalled(),
);

// Removing a wrap and then garbage collecting does not call the finalizer.
let z = {};
test_general.testFinalizeWrap(z);
test_general.removeWrap(z);
z = null;
await gcUntil(
  'finalize callback was not called upon garbage collection.',
  () => !test_general.finalizeWasCalled(),
);
