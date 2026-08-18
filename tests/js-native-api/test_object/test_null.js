// Test passing NULL to object-related Node-APIs.
const { testNull } = loadAddon('test_object');

const expectedForProperty = {
  envIsNull: 'Invalid argument',
  objectIsNull: 'Invalid argument',
  keyIsNull: 'Invalid argument',
  valueIsNull: 'Invalid argument',
};

assert.deepStrictEqual(testNull.setProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.getProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.hasProperty(), expectedForProperty);
// This is the addon's own hasOwnProperty export, not Object.prototype's.
// eslint-disable-next-line no-prototype-builtins
assert.deepStrictEqual(testNull.hasOwnProperty(), expectedForProperty);
// Not wanting the result of a deletion is allowed.
assert.deepStrictEqual(testNull.deleteProperty(), {
  ...expectedForProperty,
  valueIsNull: 'napi_ok',
});
assert.deepStrictEqual(testNull.setNamedProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.getNamedProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.hasNamedProperty(), expectedForProperty);

const expectedForElement = {
  envIsNull: 'Invalid argument',
  objectIsNull: 'Invalid argument',
  valueIsNull: 'Invalid argument',
};

assert.deepStrictEqual(testNull.setElement(), expectedForElement);
assert.deepStrictEqual(testNull.getElement(), expectedForElement);
assert.deepStrictEqual(testNull.hasElement(), expectedForElement);
// Not wanting the result of a deletion is allowed.
assert.deepStrictEqual(testNull.deleteElement(), {
  ...expectedForElement,
  valueIsNull: 'napi_ok',
});

assert.deepStrictEqual(testNull.defineProperties(), {
  envIsNull: 'Invalid argument',
  objectIsNull: 'Invalid argument',
  descriptorListIsNull: 'Invalid argument',
  utf8nameIsNull: 'Invalid argument',
  methodIsNull: 'Invalid argument',
});

// expectedForElement also describes the APIs below.
assert.deepStrictEqual(testNull.getPropertyNames(), expectedForElement);
assert.deepStrictEqual(testNull.getAllPropertyNames(), expectedForElement);
assert.deepStrictEqual(testNull.getPrototype(), expectedForElement);
