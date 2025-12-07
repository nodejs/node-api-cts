# Node-API Conformance Test Suite (`node-api-cts`)

A test suite for Node-API implementors across different JS engines and runtimes.
Written in ECMAScript & C/C++ with an implementor customizable harness.

> [!IMPORTANT]  
> This repository is currently a work-in-progress and shouldn't yet be relied on by anyone.

## Overview

The tests are divided into two buckets, based on the two header files declaring the Node-API functions:

- `tests/js-native-api/*` testing the engine-specific part of Node-API defined in the [`js_native_api.h`](https://github.com/nodejs/node-api-headers/blob/main/include/js_native_api.h) header.
- `tests/node-api/*` testing the runtime-specific part of Node-API defined in the [`node_api.h`](https://github.com/nodejs/node-api-headers/blob/main/include/node_api.h) header.
