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

To run a specific test suite or file, use the `--test-name-pattern` flag:

```bash
$ NODE_OPTIONS=--test-name-pattern=test_constructor npm run node:test
```

The pattern matches against suite names (directory names) and test names (file names)
at any level of the hierarchy. When a suite matches, all tests inside it run.
The pattern can be a regular expression.
