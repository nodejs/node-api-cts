"use strict";

// test_string addon requires Node-API version >= 10
// (node_api_create_external_string_latin1/utf16).
// Node-API 10 is supported in Node.js >= 22.14.0 and >= 23.6.0.
if (Number(napiVersion) < 10) {
  skipTest();
}

// Test passing NULL to object-related Node-APIs.
const { testNull } = loadAddon("test_string");

const expectedResult = {
  envIsNull: "Invalid argument",
  stringIsNullNonZeroLength: "Invalid argument",
  stringIsNullZeroLength: "napi_ok",
  resultIsNull: "Invalid argument",
};

assert.deepStrictEqual(expectedResult, testNull.test_create_latin1());
assert.deepStrictEqual(expectedResult, testNull.test_create_utf8());
assert.deepStrictEqual(expectedResult, testNull.test_create_utf16());
