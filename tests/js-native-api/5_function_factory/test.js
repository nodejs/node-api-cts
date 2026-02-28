'use strict';
const addon = loadAddon('5_function_factory');

const fn = addon();
assert.strictEqual(fn(), 'hello world');
