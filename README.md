# Node-API Conformance Test Suite (`node-api-cts`)

A pure ECMAScript test suite for Node-API implementors across different JS engines and runtimes.

> [!IMPORTANT]  
> This repository is currently a work-in-progress and shouldn't yet be relied on by anyone.

## Overview

The tests are divided into two buckets, based on the two header files declaring the Node-API functions:

- `tests/engine/*` testing Node-API defined in the [`js_native_api.h`](https://github.com/nodejs/node-api-headers/blob/main/include/js_native_api.h) header (located in [`./test/js-native-api` of the Node.js codebase](https://github.com/nodejs/node/tree/main/test/js-native-api)).
- `tests/runtime/*` testing Node-API defined in the [`node_api.h`](https://github.com/nodejs/node-api-headers/blob/main/include/node_api.h) header (located in [`./test/node-api` of the Node.js codebase](https://github.com/nodejs/node/tree/main/test/node-api)).
