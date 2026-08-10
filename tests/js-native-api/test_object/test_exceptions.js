// A runtime whose object APIs don't surface a throwing proxy handler as a
// pending exception leaves the throw to escape the addon entirely, so there is
// nothing meaningful to assert there.
if (!runtimeFeatures.proxyHandlerExceptions) {
  skipTest();
}

const { testExceptions } = loadAddon('test_exceptions');

function throws() {
  throw new Error('foobar');
}

// Every object API the addon calls must report the trap's throw as a pending
// exception rather than swallowing it or returning napi_ok. The native side
// asserts that for each call and clears the exception before the next one.
//
// mustCallAtLeast, not mustCall: how many times an engine consults a given
// trap is unspecified, so only the lower bound is portable.
testExceptions(
  new Proxy(
    {},
    {
      get: mustCallAtLeast(throws),
      getOwnPropertyDescriptor: mustCallAtLeast(throws),
      defineProperty: mustCallAtLeast(throws),
      deleteProperty: mustCallAtLeast(throws),
      has: mustCallAtLeast(throws),
      set: mustCallAtLeast(throws),
      ownKeys: mustCallAtLeast(throws),
    },
  ),
);
