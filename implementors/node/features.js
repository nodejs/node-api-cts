// Declares which Node-API features this runtime supports, for tests to gate on.
// Other implementors should set unsupported features to false or omit them.

const [major, minor, patch] = process.version.slice(1).split('.').map(Number);

// Experimental features behind the NAPI_EXPERIMENTAL define. Each key
// corresponds to a NODE_API_EXPERIMENTAL_HAS_* compile-time macro.
globalThis.experimentalFeatures = {
  // node_api_is_sharedarraybuffer and node_api_create_sharedarraybuffer were
  // added in Node.js v24.9.0. Earlier versions do not export these symbols,
  // causing addons that reference them to fail at dlopen time.
  sharedArrayBuffer: major >= 25 || (major === 24 && minor >= 9),
  // node_api_create_object_with_properties was added in Node.js v25.2.0 and
  // v24.12.0, and not backported to v20.x or v22.x. Earlier versions do not
  // export the symbol, so an addon referencing it fails at dlopen time.
  createObjectWithProperties:
    major > 25 || (major === 25 && minor >= 2) || (major === 24 && minor >= 12),
  setPrototype: true,
  postFinalizer: true,
};

// Version-dependent behaviors of stable Node-API, plus harness/runtime
// capabilities that aren't tied to Node-API at all (e.g. whether the runtime
// can spawn subprocesses). Implementors that lack a capability set it to false.
globalThis.runtimeFeatures = {
  // Node.js can spawn isolated subprocesses, so the spawnTest global is
  // available. Runtimes that can't (e.g. WASM, React Native) set this to false
  // and need not provide a spawnTest implementation.
  spawn: true,

  // napi_create_dataview accepts a SharedArrayBuffer-backed buffer only since
  // Node.js v24.13.1 and v25.4.0 (nodejs/node#60473). It was not backported to
  // v20.x or v22.x, where such calls fail with "invalid argument".
  dataviewSharedArrayBuffer:
    major > 25 ||
    (major === 25 && minor >= 4) ||
    (major === 24 && (minor > 13 || (minor === 13 && patch >= 1))),
};
