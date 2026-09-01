const pendingCalls = [];

// `expected` is a lower bound when `atLeast` is set, an exact count otherwise.
const track = (fn, expected, atLeast) => {
  const entry = {
    expected,
    atLeast,
    actual: 0,
    name: fn?.name || '<anonymous>',
    error: new Error(), // capture call-site stack
  };
  pendingCalls.push(entry);
  return function(...args) {
    entry.actual++;
    if (fn) return fn.apply(this, args);
  };
};

/**
 * Wraps a function and asserts it is called exactly `exact` times before the
 * process exits. If `fn` is omitted, a no-op function is used.
 *
 * Usage:
 *   promise.then(mustCall((result) => {
 *     assert.strictEqual(result, 42);
 *   }));
 */
const mustCall = (fn, exact = 1) => track(fn, exact, false);

/**
 * Like `mustCall`, but asserts only a lower bound: the wrapper must be called
 * at least `minimum` times, and any number of further calls is fine. Use it
 * when the runtime decides how often a callback fires (e.g. a proxy trap the
 * engine may consult more than once).
 */
const mustCallAtLeast = (fn, minimum = 1) => track(fn, minimum, true);

/**
 * Returns a function that throws immediately if called.
 */
const mustNotCall = (msg) => {
  return () => {
    throw new Error(msg || 'mustNotCall function was called');
  };
};

process.on('exit', () => {
  for (const entry of pendingCalls) {
    const satisfied = entry.atLeast ?
      entry.actual >= entry.expected :
      entry.actual === entry.expected;
    if (!satisfied) {
      entry.error.message =
        `mustCall${entry.atLeast ? 'AtLeast' : ''} "${entry.name}" expected ` +
        `${entry.atLeast ? 'at least ' : ''}${entry.expected} call(s) ` +
        `but got ${entry.actual}`;
      throw entry.error;
    }
  }
});

Object.assign(globalThis, { mustCall, mustCallAtLeast, mustNotCall });
