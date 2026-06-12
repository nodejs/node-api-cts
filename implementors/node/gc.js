// Capture the engine-provided gc (Node exposes it under --expose-gc) before
// we overwrite globalThis.gc with the harness wrapper below.
const engineGc = globalThis.gc;
if (typeof engineGc !== 'function') {
  throw new Error(
    'Node harness expects globalThis.gc to be available (run with --expose-gc)',
  );
}

const gc = () => {
  engineGc();
};

const gcUntil = async (name, condition) => {
  let count = 0;
  while (!condition()) {
    await new Promise((resolve) => setImmediate(resolve));
    if (++count < 10) {
      engineGc();
    } else {
      throw new Error(`GC test "${name}" failed after ${count} attempts`);
    }
  }
};

Object.assign(globalThis, { gc, gcUntil });
