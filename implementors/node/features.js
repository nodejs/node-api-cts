// Declares which experimental Node-API features this runtime supports.
// Each key corresponds to a NODE_API_EXPERIMENTAL_HAS_* compile-time macro.
// Other implementors should set unsupported features to false or omit them.

const [major, minor] = process.version.slice(1).split('.').map(Number);

globalThis.experimentalFeatures = {
  // node_api_is_sharedarraybuffer and node_api_create_sharedarraybuffer were
  // added in Node.js v24.9.0. Earlier versions do not export these symbols,
  // causing addons that reference them to fail at dlopen time.
  sharedArrayBuffer: major >= 25 || (major === 24 && minor >= 9),
  createObjectWithProperties: true,
  setPrototype: true,
  postFinalizer: true,
};

globalThis.napiVersion = Number(process.versions.napi);

globalThis.skipTest = () => {
  process.exit(0);
};
