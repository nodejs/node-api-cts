// Declares which experimental Node-API features this runtime supports.
// Each key corresponds to a NODE_API_EXPERIMENTAL_HAS_* compile-time macro.
// Other implementors should set unsupported features to false or omit them.

const [major, minor, patch] = process.version.slice(1).split(".").map(Number);

globalThis.experimentalFeatures = {
  // node_api_is_sharedarraybuffer and node_api_create_sharedarraybuffer were
  // added in Node.js v24.9.0. Earlier versions do not export these symbols,
  // causing addons that reference them to fail at dlopen time.
  sharedArrayBuffer: major >= 25 || (major === 24 && minor >= 9),
  createObjectWithProperties: true,
  setPrototype: true,
  postFinalizer: true,
  // napi_create_dataview accepts a SharedArrayBuffer-backed buffer only since
  // Node.js v24.13.1 and v25.4.0 (nodejs/node#60473). It was not backported to
  // v20.x or v22.x, where such calls fail with "invalid argument".
  dataviewSharedArrayBuffer:
    major > 25 ||
    (major === 25 && minor >= 4) ||
    (major === 24 && (minor > 13 || (minor === 13 && patch >= 1))),
};
