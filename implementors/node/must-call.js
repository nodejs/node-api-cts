/**
 * Wraps a function and returns a [wrapper, called] tuple.
 * - `wrapper` — call this in place of the original function
 * - `called` — a Promise that resolves (with the return value of fn) once
 *   wrapper has been invoked
 *
 * If `fn` is omitted, a no-op function is used.
 *
 * Usage:
 *   const [onResolve, resolved] = mustCall((result) => {
 *     assert.strictEqual(result, 42);
 *   });
 *   promise.then(onResolve);
 *   await resolved;
 */
const mustCall = (fn) => {
  let resolve;
  const called = new Promise((r) => { resolve = r; });
  const wrapper = (...args) => {
    const result = fn ? fn(...args) : undefined;
    resolve(result);
    return result;
  };
  return [wrapper, called];
};

/**
 * Returns a function that throws immediately if called.
 */
const mustNotCall = (msg) => {
  return () => {
    throw new Error(msg || "mustNotCall function was called");
  };
};

Object.assign(globalThis, { mustCall, mustNotCall });
