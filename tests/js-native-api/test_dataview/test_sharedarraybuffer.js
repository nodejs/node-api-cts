"use strict";

// napi_create_dataview accepts a SharedArrayBuffer-backed buffer only on newer
// Node.js releases (see implementors/node/features.js).
if (!experimentalFeatures.dataviewSharedArrayBuffer) {
  skipTest();
}

// Testing api calls for dataview backed by a SharedArrayBuffer
const test_dataview = loadAddon("test_dataview");

// Test for creating dataview with SharedArrayBuffer
{
  const buffer = new SharedArrayBuffer(128);
  const template = new DataView(buffer);

  const theDataview = test_dataview.CreateDataViewFromJSDataView(template);
  assert.ok(
    theDataview instanceof DataView,
    `Expect ${theDataview} to be a DataView`,
  );

  assert.strictEqual(template.buffer, theDataview.buffer);
}

// Test for creating dataview with SharedArrayBuffer and invalid range
{
  const buffer = new SharedArrayBuffer(128);
  assert.throws(() => {
    test_dataview.CreateDataView(buffer, 10, 200);
  }, RangeError);
}
