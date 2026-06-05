if (typeof assert !== 'function') {
  throw new Error('Expected a global assert function');
}

try {
  assert(true, 'assert(true, message) should not throw');
} catch (error) {
  throw new Error(`Global assert(true, message) must not throw: ${String(error)}`);
}

const failureMessage = 'assert(false, message) should throw this message';
let threw = false;

try {
  assert(false, failureMessage);
} catch (error) {
  threw = true;

  if (!(error instanceof Error)) {
    throw new Error(`Global assert(false, message) must throw an Error instance but got: ${String(error)}`);
  }

  const actualMessage = error.message;
  if (actualMessage !== failureMessage) {
    throw new Error(
      `Global assert(false, message) must throw message "${failureMessage}" but got "${actualMessage}"`,
    );
  }
}

if (!threw) {
  throw new Error('Global assert(false, message) must throw');
}

// assert.ok
if (typeof assert.ok !== 'function') {
  throw new Error('Expected assert.ok to be a function');
}
assert.ok(true);
threw = false;
try { assert.ok(false); } catch { threw = true; }
if (!threw) throw new Error('assert.ok(false) must throw');

// assert.strictEqual
if (typeof assert.strictEqual !== 'function') {
  throw new Error('Expected assert.strictEqual to be a function');
}
assert.strictEqual(1, 1);
assert.strictEqual('a', 'a');
assert.strictEqual(NaN, NaN); // uses Object.is semantics
threw = false;
try { assert.strictEqual(1, 2); } catch { threw = true; }
if (!threw) throw new Error('assert.strictEqual(1, 2) must throw');

// assert.notStrictEqual
if (typeof assert.notStrictEqual !== 'function') {
  throw new Error('Expected assert.notStrictEqual to be a function');
}
assert.notStrictEqual(1, 2);
assert.notStrictEqual('a', 'b');
threw = false;
try { assert.notStrictEqual(1, 1); } catch { threw = true; }
if (!threw) throw new Error('assert.notStrictEqual(1, 1) must throw');

// assert.deepStrictEqual
if (typeof assert.deepStrictEqual !== 'function') {
  throw new Error('Expected assert.deepStrictEqual to be a function');
}
assert.deepStrictEqual({ a: 1 }, { a: 1 });
assert.deepStrictEqual([1, 2, 3], [1, 2, 3]);
threw = false;
try { assert.deepStrictEqual({ a: 1 }, { a: 2 }); } catch { threw = true; }
if (!threw) throw new Error('assert.deepStrictEqual({ a: 1 }, { a: 2 }) must throw');

// assert.throws
if (typeof assert.throws !== 'function') {
  throw new Error('Expected assert.throws to be a function');
}
assert.throws(() => { throw new Error('oops'); }, /oops/);
assert.throws(() => { throw new TypeError('bad'); }, TypeError);
assert.throws(
  () => { const err = new Error('match me'); err.code = 'ERR_TEST'; throw err; },
  { code: 'ERR_TEST', message: 'match me' },
);
assert.throws(
  () => { throw new RangeError('validate me'); },
  (err) => err instanceof RangeError && err.message === 'validate me',
);
threw = false;
try { assert.throws(() => { /* does not throw */ }); } catch { threw = true; }
if (!threw) throw new Error('assert.throws must throw when fn does not throw');

// assert.match
if (typeof assert.match !== 'function') {
  throw new Error('Expected assert.match to be a function');
}
assert.match('hello world', /hello/);
assert.match('abc123', /^[a-z]+\d+$/);
threw = false;
try { assert.match('hello', /world/); } catch { threw = true; }
if (!threw) throw new Error('assert.match("hello", /world/) must throw');
threw = false;
try { assert.match(123, /\d+/); } catch { threw = true; }
if (!threw) throw new Error('assert.match must throw when input is not a string');
threw = false;
try { assert.match('hello', 'hello'); } catch { threw = true; }
if (!threw) throw new Error('assert.match must throw when pattern is not a RegExp');
