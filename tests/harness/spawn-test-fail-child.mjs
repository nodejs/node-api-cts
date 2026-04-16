// Spawned by spawn-test.js. Throws an error with a recognizable marker so the
// parent can assert that stderr was captured and that the non-zero exit status
// is surfaced.
throw new Error('spawn-test-fail-marker');
