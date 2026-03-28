'use strict';
const binding = loadAddon('test_new_target');

class Class extends binding.BaseClass {
  constructor() {
    super();
    this.method();
  }
  method() {
    this.ok = true;
  }
}

assert(new Class() instanceof binding.BaseClass);
assert(new Class().ok);
assert(binding.OrdinaryFunction());
assert(
  new binding.Constructor(binding.Constructor) instanceof binding.Constructor);
