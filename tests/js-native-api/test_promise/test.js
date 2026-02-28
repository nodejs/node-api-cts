'use strict';
const test_promise = loadAddon('test_promise');

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

// A resolution
{
  const expected_result = 42;
  const promise = test_promise.createPromise();
  let resolved = false;
  promise.then((result) => {
    assert.strictEqual(result, expected_result);
    resolved = true;
  });
  test_promise.concludeCurrentPromise(expected_result, true);
  await tick();
  assert(resolved, 'resolve callback was not called');
}

// A rejection
{
  const expected_result = 'It\'s not you, it\'s me.';
  const promise = test_promise.createPromise();
  let rejected = false;
  let thenCalled = false;
  promise.then(
    () => { throw new Error('unexpected resolve'); },
    (result) => {
      assert.strictEqual(result, expected_result);
      rejected = true;
    },
  ).then(() => { thenCalled = true; });
  test_promise.concludeCurrentPromise(expected_result, false);
  await tick();
  assert(rejected, 'reject callback was not called');
  assert(thenCalled, 'then after catch was not called');
}

// Chaining
{
  const expected_result = 'chained answer';
  const promise = test_promise.createPromise();
  let resolved = false;
  promise.then((result) => {
    assert.strictEqual(result, expected_result);
    resolved = true;
  });
  test_promise.concludeCurrentPromise(Promise.resolve('chained answer'), true);
  await tick();
  assert(resolved, 'chaining resolve callback was not called');
}

const promiseTypeTestPromise = test_promise.createPromise();
assert.strictEqual(test_promise.isPromise(promiseTypeTestPromise), true);
test_promise.concludeCurrentPromise(undefined, true);

const rejectPromise = Promise.reject(-1);
const expected_reason = -1;
assert.strictEqual(test_promise.isPromise(rejectPromise), true);
let caught = false;
rejectPromise.catch((reason) => {
  assert.strictEqual(reason, expected_reason);
  caught = true;
});
await tick();
assert(caught, 'catch was not called');

assert.strictEqual(test_promise.isPromise(2.4), false);
assert.strictEqual(test_promise.isPromise('I promise!'), false);
assert.strictEqual(test_promise.isPromise(undefined), false);
assert.strictEqual(test_promise.isPromise(null), false);
assert.strictEqual(test_promise.isPromise({}), false);
