# Porting Plan

This document tracks the progress of porting tests from Node.js's test suite into the CTS.
The source directories are [`test/js-native-api`](https://github.com/nodejs/node/tree/main/test/js-native-api)
and [`test/node-api`](https://github.com/nodejs/node/tree/main/test/node-api) in the Node.js repository.

## API Naming Convention

Node-API uses two function prefixes that are sometimes confused:

- **`napi_`** — the original prefix, retained for backwards compatibility
- **`node_api_`** — the newer prefix, adopted after the project was renamed from "napi" to "Node API"

The prefix alone does **not** indicate whether a function is Node.js-specific or runtime-agnostic.
What matters is which header the function is declared in:

- `js_native_api.h` — engine-agnostic APIs, available across all Node-API runtimes
- `node_api.h` — runtime-specific APIs, providing features beyond pure JavaScript value operations.

For example, `node_api_is_sharedarraybuffer` carries the newer `node_api_` prefix but is declared
in `js_native_api.h` and is therefore engine-agnostic.

## Difficulty Ratings

Difficulty is assessed on two axes:

- **Size/complexity** — total lines of C/C++ and JS across all source files
- **Runtime-API dependence** — pure `js_native_api.h` is cheapest; Node.js extensions and direct
  libuv calls require harness work or Node-only scoping

| Rating | Meaning                                                                                                  |
| ------ | -------------------------------------------------------------------------------------------------------- |
| Easy   | Small test, pure `js_native_api.h` or trivial runtime API, straightforward 1:1 port                      |
| Medium | Moderate size or uses a Node.js extension API that the harness will need to abstract                     |
| Hard   | Large test and/or deep libuv/worker/SEA dependency; may need new harness primitives or Node-only scoping |

## Engine-specific (`js-native-api`)

Tests covering the engine-specific part of Node-API, defined in `js_native_api.h`.

| Directory                    | Status     | Difficulty |
| ---------------------------- | ---------- | ---------- |
| `2_function_arguments`       | Ported     | —          |
| `3_callbacks`                | Not ported | Easy       |
| `4_object_factory`           | Not ported | Easy       |
| `5_function_factory`         | Not ported | Easy       |
| `6_object_wrap`              | Not ported | Medium     |
| `7_factory_wrap`             | Not ported | Easy       |
| `8_passing_wrapped`          | Not ported | Easy       |
| `test_array`                 | Not ported | Easy       |
| `test_bigint`                | Not ported | Easy       |
| `test_cannot_run_js`         | Not ported | Medium     |
| `test_constructor`           | Not ported | Medium     |
| `test_conversions`           | Not ported | Medium     |
| `test_dataview`              | Not ported | Easy       |
| `test_date`                  | Not ported | Easy       |
| `test_error`                 | Not ported | Medium     |
| `test_exception`             | Not ported | Medium     |
| `test_finalizer`             | Not ported | Medium     |
| `test_function`              | Not ported | Medium     |
| `test_general`               | Not ported | Hard       |
| `test_handle_scope`          | Not ported | Easy       |
| `test_instance_data`         | Not ported | Easy       |
| `test_new_target`            | Not ported | Easy       |
| `test_number`                | Not ported | Easy       |
| `test_object`                | Not ported | Hard       |
| `test_promise`               | Not ported | Easy       |
| `test_properties`            | Not ported | Easy       |
| `test_reference`             | Not ported | Medium     |
| `test_reference_double_free` | Not ported | Easy       |
| `test_sharedarraybuffer`     | Not ported | Medium     |
| `test_string`                | Not ported | Medium     |
| `test_symbol`                | Not ported | Easy       |
| `test_typedarray`            | Not ported | Medium     |

## Runtime-specific (`node-api`)

Tests covering the runtime-specific part of Node-API, defined in `node_api.h`.

| Directory                            | Status     | Difficulty |
| ------------------------------------ | ---------- | ---------- |
| `1_hello_world`                      | Not ported | Easy       |
| `test_async`                         | Not ported | Hard       |
| `test_async_cleanup_hook`            | Not ported | Hard       |
| `test_async_context`                 | Not ported | Hard       |
| `test_buffer`                        | Not ported | Medium     |
| `test_callback_scope`                | Not ported | Hard       |
| `test_cleanup_hook`                  | Not ported | Medium     |
| `test_env_teardown_gc`               | Not ported | Easy       |
| `test_exception`                     | Not ported | Easy       |
| `test_fatal`                         | Not ported | Hard       |
| `test_fatal_exception`               | Not ported | Easy       |
| `test_general`                       | Not ported | Medium     |
| `test_init_order`                    | Not ported | Medium     |
| `test_instance_data`                 | Not ported | Hard       |
| `test_make_callback`                 | Not ported | Hard       |
| `test_make_callback_recurse`         | Not ported | Hard       |
| `test_null_init`                     | Not ported | Medium     |
| `test_reference_by_node_api_version` | Not ported | Medium     |
| `test_sea_addon`                     | Not ported | Hard       |
| `test_threadsafe_function`           | Not ported | Hard       |
| `test_threadsafe_function_shutdown`  | Not ported | Hard       |
| `test_uv_loop`                       | Not ported | Hard       |
| `test_uv_threadpool_size`            | Not ported | Hard       |
| `test_worker_buffer_callback`        | Not ported | Hard       |
| `test_worker_terminate`              | Not ported | Hard       |
| `test_worker_terminate_finalization` | Not ported | Hard       |

## Experimental Node-API Features

Several tests in the upstream Node.js repository use experimental APIs that are guarded behind
`#ifdef NAPI_EXPERIMENTAL` in Node.js's `js_native_api.h`.

When `NAPI_EXPERIMENTAL` is defined in Node.js, `NAPI_VERSION` is set to
`NAPI_VERSION_EXPERIMENTAL (2147483647)`. The `NAPI_MODULE` macro exports this version, and the
runtime uses it to decide whether to enable experimental behavior for that addon.

| Feature macro                                             | APIs                                                                 | Used by                                           |
| --------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| `NODE_API_EXPERIMENTAL_HAS_SHAREDARRAYBUFFER`             | `node_api_is_sharedarraybuffer`, `node_api_create_sharedarraybuffer` | `test_dataview`, `test_sharedarraybuffer`         |
| `NODE_API_EXPERIMENTAL_HAS_CREATE_OBJECT_WITH_PROPERTIES` | `node_api_create_object_with_properties`                             | `test_object`                                     |
| `NODE_API_EXPERIMENTAL_HAS_SET_PROTOTYPE`                 | `node_api_set_prototype`                                             | `test_general`                                    |
| `NODE_API_EXPERIMENTAL_HAS_POST_FINALIZER`                | `node_api_post_finalizer`                                            | `test_general`, `test_finalizer`, `6_object_wrap` |

Tests that depend on these APIs are currently ported without the experimental test cases (marked
as "Partial" in the status column) or not ported at all.

### Infrastructure for experimental features

The CTS provides the following infrastructure (see [#26](https://github.com/nodejs/node-api-cts/issues/26)):

1. **Vendored headers** — The `include/` directory contains Node-API headers vendored directly from
   the Node.js repository (updated via `npm run update-headers`). These include experimental API
   declarations behind `#ifdef NAPI_EXPERIMENTAL`.

2. **CMake build function** — `add_node_api_cts_experimental_addon()` compiles an addon with
   `NAPI_EXPERIMENTAL` defined, enabling all experimental API declarations and setting
   `NAPI_VERSION` to `NAPI_VERSION_EXPERIMENTAL` (2147483647).

3. **Implementor feature declaration** — Each runtime provides a `features.js` harness module that
   sets `globalThis.experimentalFeatures` to an object declaring which experimental features it
   supports (e.g., `{ sharedArrayBuffer: true, postFinalizer: true }`).

4. **Conditional test execution** — JS test files guard experimental assertions behind feature
   checks. When a feature is unsupported, the guarded code silently does not execute.

   ```js
   if (experimentalFeatures.sharedArrayBuffer) {
     const addon = loadAddon("test_sharedarraybuffer");
     // ... assertions
   }
   ```

   The `loadAddon` call must be inside the guard because addons linked against experimental
   symbols will fail to load on runtimes that don't export those symbols.

## Special Considerations

### `node_api_post_finalizer` (`6_object_wrap`, `test_finalizer`)

Both tests call `node_api_post_finalizer` to defer JS-touching work out of the GC finalizer and
onto the main thread. The function is declared in `js_native_api.h` but is gated behind
`NAPI_EXPERIMENTAL`, so not all runtimes may implement it yet. The CTS harness will need a
platform-agnostic post-finalizer primitive that implementors can map to their own
deferred-callback mechanism, or the tests need to isolate the post-finalizer cases behind a
runtime capability check.

### `node_api_set_prototype` / `napi_get_prototype` (`test_general`, js-native-api)

The general test suite mixes `js_native_api.h` assertions with calls to `node_api_set_prototype`
(gated behind `NAPI_EXPERIMENTAL`) and `napi_get_prototype` (standard). The experimental function
may not be implemented by all runtimes yet. The CTS port should split the affected test cases into
a stable core and an experimental annex, or guard the `node_api_set_prototype` cases with a
runtime capability check.

### SharedArrayBuffer backing-store creation (`test_sharedarraybuffer`)

`node_api_is_sharedarraybuffer` and `node_api_create_sharedarraybuffer` are both declared in
`js_native_api.h` and are engine-agnostic. However, the test also exercises creating a
SharedArrayBuffer from the C side via `node_api_create_sharedarraybuffer`, which allocates
backing store memory. The CTS version will need a harness-provided factory (something like
`create_shared_array_buffer(size)`) that each runtime can implement using its own path.

### libuv dependency (multiple `node-api` tests)

The following tests call into libuv directly — `napi_get_uv_event_loop`, `uv_thread_t`,
`uv_mutex_t`, `uv_async_t`, `uv_check_t`, `uv_idle_t`, `uv_queue_work`, and related APIs:

- `test_async`, `test_async_cleanup_hook`, `test_async_context`
- `test_callback_scope`
- `test_fatal` (uses `uv_thread_t` to test cross-thread fatal errors)
- `test_instance_data` (async work + threadsafe functions + `uv_thread_t`)
- `test_uv_loop`, `test_uv_threadpool_size`

Porting options:

1. **Node-only scope** — mark these tests as Node.js-only and skip on other runtimes.
2. **Harness abstraction** — introduce a minimal platform-agnostic threading/async API in the
   harness (e.g., `cts_thread_create`, `cts_async_schedule`) that implementors back with their
   own event loop primitives (libuv, tokio, etc.).

### Threadsafe functions (`test_threadsafe_function`, `test_threadsafe_function_shutdown`)

`test_threadsafe_function` is the largest single test (~700 total lines across C and JS), covering
blocking/non-blocking queue modes, queue-full handling, multiple concurrent threads, finalization
ordering, uncaught exception propagation, and high-precision timing via `uv_hrtime`. The threading
primitives are libuv-specific (same concern as the section above). Porting this test likely depends
on resolving the libuv abstraction question first.

### Worker threads (`test_worker_buffer_callback`, `test_worker_terminate`, `test_worker_terminate_finalization`)

These three tests exercise addon behavior inside Node.js worker threads: buffer finalizer delivery
in worker contexts, function-call behavior under pending exceptions during worker shutdown, and
wrapped-object finalization on forced worker termination. Node.js worker threads have no direct
equivalent in most other Node-API runtimes. These tests are likely Node.js-only and should be
scoped accordingly.

### SEA — Single Executable Applications (`test_sea_addon`)

`test_sea_addon` verifies that a native addon can be loaded inside a Node.js Single Executable
Application. SEA is a Node.js-specific packaging feature with no equivalent in other runtimes.
This test should be excluded from the CTS scope or placed in a Node-only annex.

### `napi_get_node_version` (`test_general`, node-api)

`test_general` calls `napi_get_node_version`, which returns the Node.js major/minor/patch version.
No equivalent exists in other runtimes. The CTS port should either omit that assertion or expose a
harness helper (e.g., `cts_get_runtime_version`) that runtimes can optionally implement.

### Legacy module registration (`test_null_init`)

`test_null_init` exercises the deprecated `NAPI_MODULE` macro with a NULL init function, calling
`napi_module_register` directly. Some newer runtimes that implement Node-API may not support this
legacy registration path. If so, this test should be scoped as Node-only or skipped on runtimes
that only support `NAPI_MODULE_INIT`.
