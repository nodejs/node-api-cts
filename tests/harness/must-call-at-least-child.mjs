// Spawned by must-call.js. Calls a wrapper that demands at least two calls
// only once, so the parent can assert that the shortfall is reported at exit.
const wrapper = mustCallAtLeast(function underCalled() {}, 2);
wrapper();
