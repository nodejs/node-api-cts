// napi_create_typedarray accepts a SharedArrayBuffer-backed buffer only on
// newer Node.js releases (see implementors/node/features.js).
if (!runtimeFeatures.typedarraySharedArrayBuffer) {
  skipTest();
}

// Verify SharedArrayBuffer-backed typed arrays can be created through
// napi_create_typedarray, while preserving the existing ArrayBuffer behavior.
const addon = loadAddon('test_typedarray_sharedarraybuffer');

// Float16Array is an ES2025 addition, not exposed by default in older V8
// versions. See the longer note in test.js.
const hasFloat16Array = typeof Float16Array !== 'undefined';

const typedArrayCases = [
  { type: Int8Array, values: [-1, 0, 127] },
  { type: Uint8Array, values: [1, 2, 255] },
  { type: Uint8ClampedArray, values: [0, 128, 255] },
  { type: Int16Array, values: [-1, 0, 32767] },
  { type: Uint16Array, values: [1, 2, 65535] },
  { type: Int32Array, values: [-1, 0, 123456789] },
  { type: Uint32Array, values: [1, 2, 4294967295] },
  ...(hasFloat16Array ? [{ type: Float16Array, values: [0.5, -1.5, 42.25] }] : []),
  { type: Float32Array, values: [0.5, -1.5, 42.25] },
  { type: Float64Array, values: [0.5, -1.5, 42.25] },
  { type: BigInt64Array, values: [1n, -2n, 123456789n] },
  { type: BigUint64Array, values: [1n, 2n, 123456789n] },
];

function createBuffer(Type, BufferType, length) {
  const byteOffset = Type.BYTES_PER_ELEMENT;
  const byteLength = byteOffset + (length * Type.BYTES_PER_ELEMENT);
  return {
    buffer: new BufferType(byteLength),
    byteOffset,
  };
}

function verifyTypedArray(Type, buffer, byteOffset, values) {
  const template = new Type(buffer, byteOffset, values.length);
  const theArray = addon.CreateTypedArray(template, buffer);
  const theArrayBuffer = addon.GetArrayBuffer(theArray);

  assert.ok(theArray instanceof Type);
  assert.strictEqual(theArray.buffer, buffer);
  assert.strictEqual(theArrayBuffer, buffer);
  assert.strictEqual(theArray.byteOffset, byteOffset);
  assert.strictEqual(theArray.length, values.length);

  theArray.set(values);
  assert.deepStrictEqual(
    Array.from(new Type(buffer, byteOffset, values.length)),
    values,
  );
}

// Keep the existing ArrayBuffer behavior covered while focusing this test
// on SharedArrayBuffer-backed TypedArray creation.
{
  const { buffer, byteOffset } = createBuffer(Uint8Array, ArrayBuffer, 3);
  verifyTypedArray(Uint8Array, buffer, byteOffset, [1, 2, 3]);
}

// Verify all TypedArray variants can be created from a SharedArrayBuffer.
for (const { type, values } of typedArrayCases) {
  const { buffer, byteOffset } = createBuffer(
    type,
    SharedArrayBuffer,
    values.length,
  );
  verifyTypedArray(type, buffer, byteOffset, values);
}

// Test for creating TypedArrays with SharedArrayBuffer and invalid range.
for (const { type, values } of typedArrayCases) {
  const { buffer, byteOffset } = createBuffer(
    type,
    SharedArrayBuffer,
    values.length,
  );
  const template = new type(buffer, byteOffset, values.length);

  assert.throws(() => {
    addon.CreateTypedArray(template, buffer, values.length + 1, byteOffset);
  }, RangeError);
}

// Test for creating TypedArrays with SharedArrayBuffer and invalid alignment.
for (const { type, values } of typedArrayCases) {
  if (type.BYTES_PER_ELEMENT <= 1) {
    continue;
  }

  const { buffer, byteOffset } = createBuffer(
    type,
    SharedArrayBuffer,
    values.length,
  );
  const template = new type(buffer, byteOffset, values.length);

  assert.throws(() => {
    addon.CreateTypedArray(template, buffer, 1, byteOffset + 1);
  }, RangeError);
}

// Test invalid arguments.
{
  const template = new Uint8Array(1);

  assert.throws(() => {
    addon.CreateTypedArray(template, {});
  }, { name: 'Error', message: 'Invalid argument' });

  assert.throws(() => {
    addon.CreateTypedArray(template, 1);
  }, { name: 'Error', message: 'Invalid argument' });
}
