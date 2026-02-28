'use strict';
const addon = loadAddon('3_callbacks');

let called = false;
addon.RunCallback((msg) => {
  assert.strictEqual(msg, 'hello world');
  called = true;
});
assert(called);

function testRecv(desiredRecv) {
  let recvCalled = false;
  addon.RunCallbackWithRecv(function() {
    assert.strictEqual(this, desiredRecv);
    recvCalled = true;
  }, desiredRecv);
  assert(recvCalled);
}

testRecv(undefined);
testRecv(null);
testRecv(5);
testRecv(true);
testRecv('Hello');
testRecv([]);
testRecv({});
