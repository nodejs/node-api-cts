
import {
  ok,
  strictEqual,
  notStrictEqual,
  deepStrictEqual,
  throws,
} from "node:assert/strict";

const assert = Object.assign(
  (value, message) => ok(value, message),
  {
    ok: (value, message) => ok(value, message),
    strictEqual: (actual, expected, message) =>
      strictEqual(actual, expected, message),
    notStrictEqual: (actual, expected, message) =>
      notStrictEqual(actual, expected, message),
    deepStrictEqual: (actual, expected, message) =>
      deepStrictEqual(actual, expected, message),
    throws: (fn, error, message) => throws(fn, error, message),
  },
);

Object.assign(globalThis, { assert });
