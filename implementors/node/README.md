# Harness of Node.js

## Build addons

To build the addons, run the following command:

```bash
$ npm run addons:configure
$ npm run addons:build
```

## Running tests

Run the following command to run the tests:

```bash
$ npm run node:test
```

To run a specific test file, use the `--test-name-pattern` flag:

```bash
$ NODE_OPTIONS=--test-name-pattern=js-native-api/test_constructor/test_null npm run node:test
```

The test names are their relative path to the `tests` folder, with file extensions.
The pattern can be a regular expression.
