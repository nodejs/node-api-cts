if (typeof gcUntil !== 'function') {
  throw new Error('Expected a global gcUntil function');
}

// gcUntil should resolve once the condition becomes true
let count = 0;
await gcUntil('test-passes', () => {
  count++;
  return count >= 2;
});
if (count < 2) {
  throw new Error(`Expected condition to be checked at least twice, got ${count}`);
}

// gcUntil should throw after exhausting retries when condition never becomes true
let threw = false;
try {
  await gcUntil('test-fails', () => false);
} catch (error) {
  threw = true;
  if (!error.message.includes('test-fails')) {
    throw new Error(`Expected error message to include 'test-fails' but got: ${error.message}`);
  }
}
if (!threw) {
  throw new Error('gcUntil must throw when the condition never becomes true');
}
