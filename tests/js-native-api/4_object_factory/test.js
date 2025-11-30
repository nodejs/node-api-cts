
const factory = loadAddon('4_object_factory');
assert(typeof factory === 'function');

const obj1 = factory('hello');
const obj2 = factory('world');
assert(`${obj1.msg} ${obj2.msg}` === 'hello world');
