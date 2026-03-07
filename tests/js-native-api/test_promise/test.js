'use strict';
const test_promise = loadAddon('test_promise');

// A resolution
{
  const expected_result = 42;
  const promise = test_promise.createPromise();
  const [onResolve, resolved] = mustCall((result) => {
    assert.strictEqual(result, expected_result);
  });
  promise.then(onResolve);
  test_promise.concludeCurrentPromise(expected_result, true);
  await resolved;
}

// A rejection
{
  const expected_result = 'It\'s not you, it\'s me.';
  const promise = test_promise.createPromise();
  const [onReject, rejected] = mustCall((result) => {
    assert.strictEqual(result, expected_result);
  });
  const [onThen, thenCalled] = mustCall();
  promise.then(mustNotCall(), onReject).then(onThen);
  test_promise.concludeCurrentPromise(expected_result, false);
  await thenCalled;
}

// Chaining
{
  const expected_result = 'chained answer';
  const promise = test_promise.createPromise();
  const [onResolve, resolved] = mustCall((result) => {
    assert.strictEqual(result, expected_result);
  });
  promise.then(onResolve);
  test_promise.concludeCurrentPromise(Promise.resolve('chained answer'), true);
  await resolved;
}

const promiseTypeTestPromise = test_promise.createPromise();
assert.strictEqual(test_promise.isPromise(promiseTypeTestPromise), true);
test_promise.concludeCurrentPromise(undefined, true);

const rejectPromise = Promise.reject(-1);
const expected_reason = -1;
assert.strictEqual(test_promise.isPromise(rejectPromise), true);
const [onCatch, caught] = mustCall((reason) => {
  assert.strictEqual(reason, expected_reason);
});
rejectPromise.catch(onCatch);
await caught;

assert.strictEqual(test_promise.isPromise(2.4), false);
assert.strictEqual(test_promise.isPromise('I promise!'), false);
assert.strictEqual(test_promise.isPromise(undefined), false);
assert.strictEqual(test_promise.isPromise(null), false);
assert.strictEqual(test_promise.isPromise({}), false);
