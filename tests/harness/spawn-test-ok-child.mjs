// Spawned by spawn-test.js. Confirms harness globals are injected into the
// child process by checking `assert` exists, then exits 0.
if (typeof assert !== 'function') {
  throw new Error('Expected `assert` to be a CTS harness global inside spawned children');
}
