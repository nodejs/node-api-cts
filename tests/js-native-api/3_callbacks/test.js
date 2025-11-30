const addon = loadAddon('3_callbacks');

const { RunCallback, RunCallbackWithRecv } = addon;

assert(typeof RunCallback === "function");
let called = false;
RunCallback(function (msg) {
  called = true;
  assert(msg === 'hello world', 'Callback should receive "hello world"');
});
assert(called, 'Callback should have been called');

function testRecv(desiredRecv) {
  assert(typeof RunCallbackWithRecv === "function");
  let called = false;
  RunCallbackWithRecv(function () {
    called = true;
    assert(this === desiredRecv, `Expected this to be ${String(desiredRecv)}`);
  }, desiredRecv);
  assert(called, 'Callback should have been called');
}

testRecv(undefined);
testRecv(null);
testRecv(5);
testRecv(true);
testRecv('Hello');
testRecv([]);
testRecv({});
