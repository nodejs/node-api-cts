// Spawned by spawn-test.js to verify that custom nodeFlags reach the child.
// With --stack-trace-limit=42, Node sets Error.stackTraceLimit to 42; without
// the flag it keeps V8's default (10).
if (Error.stackTraceLimit !== 42) {
  throw new Error(
    `Expected Error.stackTraceLimit to be 42 when --stack-trace-limit is forwarded, got ${Error.stackTraceLimit}`
  );
}
