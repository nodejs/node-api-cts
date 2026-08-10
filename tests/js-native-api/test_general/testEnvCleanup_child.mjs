// Spawned by testEnvCleanup.js. Wraps objects, keeps them reachable until the
// process exits, and lets environment teardown run their finalizers. Each
// finalizer prints a line naming its case; the parent checks which lines
// appear.
const test_general = loadAddon('test_general');

// The second argument to envCleanupWrap() indexes a static string array on the
// native side. Reproduced here as a reverse mapping for clarity.
const finalizerMessages = {
  'simple wrap': 0,
  'wrap, removeWrap': 1,
  'first wrap': 2,
  'second wrap': 3,
};

// Held in module scope so nothing is collected before the process exits.
const kept = {};

// A plain wrap: its finalizer runs at teardown.
kept['simple wrap'] = test_general.envCleanupWrap(
  {},
  finalizerMessages['simple wrap'],
);

// A removed wrap: its finalizer must not run.
kept['wrap, removeWrap'] = test_general.envCleanupWrap(
  {},
  finalizerMessages['wrap, removeWrap'],
);
test_general.removeWrap(kept['wrap, removeWrap']);

// Re-wrapped: only the latest attached finalizer runs.
kept['first wrap'] = test_general.envCleanupWrap(
  {},
  finalizerMessages['first wrap'],
);
test_general.removeWrap(kept['first wrap']);
test_general.envCleanupWrap(
  kept['first wrap'],
  finalizerMessages['second wrap'],
);
