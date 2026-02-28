'use strict';
const test_dataview = loadAddon('test_dataview');

// Test for creating dataview with ArrayBuffer
{
  const buffer = new ArrayBuffer(128);
  const template = Reflect.construct(DataView, [buffer]);

  const theDataview = test_dataview.CreateDataViewFromJSDataView(template);
  assert(theDataview instanceof DataView,
    `Expect ${theDataview} to be a DataView`);
}

// Test for creating dataview with ArrayBuffer and invalid range
{
  const buffer = new ArrayBuffer(128);
  assert.throws(() => {
    test_dataview.CreateDataView(buffer, 10, 200);
  }, RangeError);
}

