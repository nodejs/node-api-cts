const test_general = loadAddon('test_general');

assert.strictEqual(test_general.getUndefined(), undefined);
assert.strictEqual(test_general.getNull(), null);
