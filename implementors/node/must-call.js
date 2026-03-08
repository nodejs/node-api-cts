const pendingCalls = [];

/**
 * Wraps a function and asserts it is called exactly `exact` times before the
 * process exits. If `fn` is omitted, a no-op function is used.
 *
 * Usage:
 *   promise.then(mustCall((result) => {
 *     assert.strictEqual(result, 42);
 *   }));
 */
const mustCall = (fn, exact = 1) => {
  const entry = {
    exact,
    actual: 0,
    name: fn?.name || "<anonymous>",
    error: new Error(), // capture call-site stack
  };
  pendingCalls.push(entry);
  return function(...args) {
    entry.actual++;
    if (fn) return fn.apply(this, args);
  };
};

/**
 * Returns a function that throws immediately if called.
 */
const mustNotCall = (msg) => {
  return () => {
    throw new Error(msg || "mustNotCall function was called");
  };
};

process.on("exit", () => {
  for (const entry of pendingCalls) {
    if (entry.actual !== entry.exact) {
      entry.error.message =
        `mustCall "${entry.name}" expected ${entry.exact} call(s) ` +
        `but got ${entry.actual}`;
      throw entry.error;
    }
  }
});

Object.assign(globalThis, { mustCall, mustNotCall });
