// Child of testFinalizerException.js. The addon throws during Init with its
// exports on `.binding`; createExternal installs a finalizer that throws.
try {
  loadAddon('test_exception');
} catch (anException) {
  anException.binding.createExternal();
}

// GC until the finalizer fires; its throw crashes the process, printing to
// stderr for the parent to match. The counter just bounds the loop.
let gcCount = 10;
await gcUntil('test', () => --gcCount <= 0);
