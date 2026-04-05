// Test passing NULL to object-related Node-APIs.
const { testNull } = loadAddon('test_constructor');
const expectedResult = {
  envIsNull: 'Invalid argument',
  nameIsNull: 'Invalid argument',
  lengthIsZero: 'napi_ok',
  nativeSideIsNull: 'Invalid argument',
  dataIsNull: 'napi_ok',
  propsLengthIsZero: 'napi_ok',
  propsIsNull: 'Invalid argument',
  resultIsNull: 'Invalid argument',
};

assert.deepStrictEqual(testNull.testDefineClass(), expectedResult);
