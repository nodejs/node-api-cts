// mustCall is a function
if (typeof mustCall !== 'function') {
  throw new Error('Expected a global mustCall function');
}

// mustCall returns a wrapper function (not a tuple)
{
  const wrapper = mustCall();
  if (typeof wrapper !== 'function') {
    throw new Error('mustCall() must return a function');
  }
  wrapper();
}

// mustCall forwards arguments and return value
{
  const wrapper = mustCall((a, b) => a + b);
  const result = wrapper(2, 3);
  assert.strictEqual(result, 5);
}

// mustCall without fn argument works as a no-op wrapper
{
  const wrapper = mustCall();
  const result = wrapper('ignored');
  assert.strictEqual(result, undefined);
}

// mustNotCall is a function
if (typeof mustNotCall !== 'function') {
  throw new Error('Expected a global mustNotCall function');
}

// mustNotCall returns a function
{
  const fn = mustNotCall();
  if (typeof fn !== 'function') {
    throw new Error('mustNotCall() must return a function');
  }
}

// mustNotCall() throws when called
{
  const fn = mustNotCall();
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error('mustNotCall() must throw when called');
}

// mustNotCall(msg) includes the message
{
  const fn = mustNotCall('custom message');
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = true;
    if (!(error instanceof Error)) {
      throw new Error('mustNotCall must throw an Error instance');
    }
    if (!error.message.includes('custom message')) {
      throw new Error(`mustNotCall error must include custom message, got: "${error.message}"`);
    }
  }
  if (!threw) throw new Error('mustNotCall(msg) must throw when called');
}
