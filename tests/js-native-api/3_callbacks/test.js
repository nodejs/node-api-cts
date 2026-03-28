'use strict';
const addon = loadAddon('3_callbacks');

addon.RunCallback(mustCall((msg) => {
  assert.strictEqual(msg, 'hello world');
}));

function testRecv(desiredRecv) {
  addon.RunCallbackWithRecv(mustCall(function() {
    assert.strictEqual(this, desiredRecv);
  }), desiredRecv);
}

testRecv(undefined);
testRecv(null);
testRecv(5);
testRecv(true);
testRecv('Hello');
testRecv([]);
testRecv({});
