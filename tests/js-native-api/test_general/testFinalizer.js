// addFinalizerOnly calls back into JS from a finalizer, which is only legal
// via node_api_post_finalizer. That API is experimental, so it lives in its
// own addon and the stable test_general addon stays loadable everywhere.
if (!experimentalFeatures.postFinalizer) {
  skipTest();
}

const test_general = loadAddon('test_general');
const test_general_finalizer = loadAddon('test_general_finalizer');

// Two finalizers on one object: both must fire.
let calls = 0;
const callback = mustCall(() => {
  calls++;
}, 2);

let finalized = {};
test_general_finalizer.addFinalizerOnly(finalized, callback);
test_general_finalizer.addFinalizerOnly(finalized, callback);

// A finalizer-only attachment is not a wrap, so the attached item can be
// neither retrieved nor removed.
assert.throws(
  () => test_general.unwrap(finalized),
  { name: 'Error', message: 'Invalid argument' },
);
assert.throws(
  () => test_general.removeWrap(finalized),
  { name: 'Error', message: 'Invalid argument' },
);

finalized = null;
// The callbacks are posted rather than run inline during GC, so wait for them
// instead of assuming a single collection is enough.
await gcUntil('finalizer-only callbacks ran', () => calls === 2);

// An item added to an already-wrapped object gets its own finalizer, and the
// wrap's finalizer still runs too.
assert.strictEqual(test_general.derefItemWasCalled(), false);

let finalizeAndWrap = {};
test_general.wrap(finalizeAndWrap);
test_general_finalizer.addFinalizerOnly(finalizeAndWrap, mustCall());
finalizeAndWrap = null;
await gcUntil(
  'finalize and wrap',
  () => test_general.derefItemWasCalled(),
);
