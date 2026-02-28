const gcUntil = async (name, condition) => {
  let count = 0;
  while (!condition()) {
    await new Promise((resolve) => setImmediate(resolve));
    if (++count < 10) {
      globalThis.gc();
    } else {
      throw new Error(`GC test "${name}" failed after ${count} attempts`);
    }
  }
};

Object.assign(globalThis, { gcUntil });
