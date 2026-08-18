const test_general = loadAddon('test_general');

// napi_instanceof must agree with the `instanceof` operator, including when a
// constructor overrides Symbol.hasInstance.
function compareToNative(theObject, theConstructor) {
  assert.strictEqual(
    test_general.doInstanceOf(theObject, theConstructor),
    theObject instanceof theConstructor,
  );
}

function MyClass() {}
Object.defineProperty(MyClass, Symbol.hasInstance, {
  value: function(candidate) {
    return 'mark' in candidate;
  },
});

function MySubClass() {}
MySubClass.prototype = new MyClass();

// MySubClass inherits MyClass's Symbol.hasInstance, so both constructors
// answer "does the candidate carry a mark?" rather than walking the prototype
// chain -- which is exactly what makes y fail against its own constructor.
let x = new MySubClass();
let y = new MySubClass();
x.mark = true;

compareToNative(x, MySubClass);
compareToNative(y, MySubClass);
compareToNative(x, MyClass);
compareToNative(y, MyClass);

x = new MyClass();
y = new MyClass();
x.mark = true;

compareToNative(x, MySubClass);
compareToNative(y, MySubClass);
compareToNative(x, MyClass);
compareToNative(y, MyClass);
