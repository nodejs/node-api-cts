import {
  ok,
  strictEqual,
  notStrictEqual,
  deepStrictEqual,
  throws,
  match,
} from 'node:assert/strict';

// Forward with rest arguments rather than named parameters: an omitted trailing
// message has to stay omitted. Node.js 26 reads the message as a variadic tuple,
// so an explicitly passed `undefined` is a message of the wrong type there and
// the assertion fails with ERR_INVALID_ARG_TYPE instead of the value comparison.
const assert = Object.assign((...args) => ok(...args), {
  ok: (...args) => ok(...args),
  strictEqual: (...args) => strictEqual(...args),
  notStrictEqual: (...args) => notStrictEqual(...args),
  deepStrictEqual: (...args) => deepStrictEqual(...args),
  throws: (...args) => throws(...args),
  match: (...args) => match(...args),
});

Object.assign(globalThis, { assert });
