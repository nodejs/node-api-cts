// spawnTest is a function
if (typeof spawnTest !== 'function') {
  throw new Error('Expected a global spawnTest function');
}

// Successful child: exits 0, stderr empty, and harness globals are available
// inside the child (the child checks `typeof assert === 'function'` itself).
{
  const result = spawnTest('spawn-test-ok-child.mjs');
  assert.strictEqual(result.status, 0, `ok child exited with status ${result.status}; stderr:\n${result.stderr}`);
  assert.strictEqual(result.signal, null);
  assert.strictEqual(result.stderr, '');
}

// Failing child: non-zero status and stderr contains the thrown marker.
{
  const result = spawnTest('spawn-test-fail-child.mjs');
  assert.notStrictEqual(result.status, 0, 'fail child should exit non-zero');
  if (!result.stderr.includes('spawn-test-fail-marker')) {
    throw new Error(`Expected stderr to include the failure marker, got:\n${result.stderr}`);
  }
}

// Result shape: all four fields are present.
{
  const result = spawnTest('spawn-test-ok-child.mjs');
  for (const key of ['status', 'signal', 'stdout', 'stderr']) {
    if (!(key in result)) {
      throw new Error(`Expected spawnTest result to have "${key}" field`);
    }
  }
  assert.strictEqual(typeof result.stdout, 'string');
  assert.strictEqual(typeof result.stderr, 'string');
}

// cwd is forwarded to the child: running from the parent of tests/harness
// makes the bare child filename unresolvable. The child's stderr must name
// the specific file Node tried to load, proving cwd actually shifted.
{
  const result = spawnTest('spawn-test-ok-child.mjs', { cwd: '..' });
  assert.notStrictEqual(result.status, 0, 'expected cwd ".." to make the child filename unresolvable');
  if (!result.stderr.includes('spawn-test-ok-child.mjs')) {
    throw new Error(`Expected stderr to reference the unresolved child filename, got:\n${result.stderr}`);
  }
}
