# Copilot Instructions for node-api-cts

## Project Overview

Node-API Conformance Test Suite: A pure ECMAScript test suite for Node-API implementors across different JS engines and runtimes (Node.js, Deno, Bun, React Native, WebAssembly, etc.).

## General Principles
- **Keep it minimal**: Avoid unnecessary dependencies, configuration, or complexity
- **Pure ECMAScript tests**: To lower the barrier for implementors to run the tests, all tests are written as single files of pure ECMAScript, with no import / export statements and no use of Node.js runtime APIs outside of the language standard (such as `process`, `require`, `node:*` modules).
- **TypeScript tooling**: The tooling around the tests are written in TypeScript and expects to be ran in a Node.js compatible runtime with type-stripping enabled. Never rely on `ts-node`, `node --loader ts-node/esm`, or `--experimental-strip-types`; use only stable, built-in Node.js capabilities.
- **Implementor Flexibility**: Native code building and loading is delegated to implementors, with the test-suite providing defaults that work for Node.js.
- **Extra convenience**: Extra (generated) code is provided to make it easier for implementors to load and run tests, such as extra package exports exposing test functions that implementors can integrate with their preferred test frameworks.
- **Process Isolation**: The built-in runner for Node.js, run each test in isolation to prevent crashes from aborting entire test suite.

## Development Focus
- Port existing tests from `nodejs/node/test/js-native-api` into `tests/engine/` and `nodejs/node/test/node-api` into `tests/runtime/`, removing dependencies on Node.js runtime APIs while preserving test coverage
- Structure tests for easy integration by external implementors
- Consider following patterns from [web-platform-tests](https://web-platform-tests.org/) and [WebGPU CTS](https://github.com/gpuweb/cts) projects where applicable.
