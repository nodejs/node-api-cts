'use strict';

assert.ok(
  typeof experimentalFeatures === 'object' && experimentalFeatures !== null,
  'Expected a global experimentalFeatures object'
);

// Every expected feature must be declared as a boolean (true or false).
// Update this list when new NODE_API_EXPERIMENTAL_HAS_* macros are added.
const expectedFeatures = [
  'sharedArrayBuffer',
  'createObjectWithProperties',
  'setPrototype',
  'postFinalizer',
];

for (const feature of expectedFeatures) {
  assert.strictEqual(
    typeof experimentalFeatures[feature],
    'boolean',
    `Expected experimentalFeatures.${feature} to be a boolean`
  );
}
