const napiVersion = Number(process.versions.napi);

const skipTest = () => {
  process.exit(0);
};

Object.assign(globalThis, { napiVersion, skipTest });
