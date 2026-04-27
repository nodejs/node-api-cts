// Declares which experimental Node-API features this runtime supports.
// Each key corresponds to a NODE_API_EXPERIMENTAL_HAS_* compile-time macro.
// Other implementors should set unsupported features to false or omit them.
globalThis.experimentalFeatures = {
  sharedArrayBuffer: true,
  createObjectWithProperties: true,
  setPrototype: true,
  postFinalizer: true,
};
