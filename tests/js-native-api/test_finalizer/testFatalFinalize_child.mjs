// Child of testFatalFinalize.js: a finalizer that illegally calls into JS from
// a basic finalizer context, which makes Node-API abort the process.
const test_finalizer = loadAddon('test_finalizer');

(() => {
  const obj = {};
  test_finalizer.addFinalizerFailOnJS(obj);
})();

// The abort happens inside the finalizer, so this never returns; the counter
// guard only matters if the illegal call is somehow accepted.
let gcCount = 10;
await gcUntil('fatal finalize', () => --gcCount <= 0);
