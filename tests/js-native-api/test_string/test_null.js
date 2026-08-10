// Test passing NULL to object-related Node-APIs.
const { testNull } = loadAddon('test_string');

const expectedResult = {
  envIsNull: 'Invalid argument',
  stringIsNullNonZeroLength: 'Invalid argument',
  stringIsNullZeroLength: 'napi_ok',
  resultIsNull: 'Invalid argument',
};

assert.deepStrictEqual(expectedResult, testNull.test_create_latin1());
assert.deepStrictEqual(expectedResult, testNull.test_create_utf8());
assert.deepStrictEqual(expectedResult, testNull.test_create_utf16());
