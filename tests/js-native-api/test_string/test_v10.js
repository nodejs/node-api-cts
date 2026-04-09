"use strict";

// Tests for Node-API version >= 10 APIs:
// node_api_create_external_string_latin1/utf16 and
// node_api_create_property_key_latin1/utf8/utf16.
if (Number(napiVersion) < 10) {
  skipTest();
}

const test_string_v10 = loadAddon("test_string_v10");
// The insufficient buffer test case allocates a buffer of size 4, including
// the null terminator.
const kInsufficientIdx = 3;

const asciiCases = [
  "",
  "hello world",
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  "?!@#$%^&*()_+-=[]{}/.,<>'\"\\",
];

const latin1Cases = [
  {
    str: "¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿",
    utf8Length: 62,
    utf8InsufficientIdx: 1,
  },
  {
    str: "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ",
    utf8Length: 126,
    utf8InsufficientIdx: 1,
  },
];

const unicodeCases = [
  {
    str: "\u{2003}\u{2101}\u{2001}\u{202}\u{2011}",
    utf8Length: 14,
    utf8InsufficientIdx: 1,
  },
];

function testLatin1ExternalCases(str) {
  assert.strictEqual(test_string_v10.TestLatin1External(str), str);
  assert.strictEqual(test_string_v10.TestLatin1ExternalAutoLength(str), str);
  assert.strictEqual(test_string_v10.TestPropertyKeyLatin1(str), str);
  assert.strictEqual(test_string_v10.TestPropertyKeyLatin1AutoLength(str), str);
}

function testUnicodeExternalCases(str) {
  assert.strictEqual(test_string_v10.TestUtf16External(str), str);
  assert.strictEqual(test_string_v10.TestUtf16ExternalAutoLength(str), str);
  assert.strictEqual(test_string_v10.TestPropertyKeyUtf8(str), str);
  assert.strictEqual(test_string_v10.TestPropertyKeyUtf8AutoLength(str), str);
  assert.strictEqual(test_string_v10.TestPropertyKeyUtf16(str), str);
  assert.strictEqual(test_string_v10.TestPropertyKeyUtf16AutoLength(str), str);
}

asciiCases.forEach(testLatin1ExternalCases);
asciiCases.forEach(testUnicodeExternalCases);
latin1Cases.forEach((it) => testLatin1ExternalCases(it.str));
latin1Cases.forEach((it) => testUnicodeExternalCases(it.str));
unicodeCases.forEach((it) => testUnicodeExternalCases(it.str));
