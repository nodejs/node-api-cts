'use strict';
const { testNull } = loadAddon('test_number');

const expectedCreateResult = {
  envIsNull: 'Invalid argument',
  resultIsNull: 'Invalid argument',
};
const expectedGetValueResult = {
  envIsNull: 'Invalid argument',
  resultIsNull: 'Invalid argument',
  valueIsNull: 'Invalid argument',
};
[ 'Double', 'Int32', 'Uint32', 'Int64' ].forEach((typeName) => {
  assert.deepStrictEqual(testNull['create' + typeName](), expectedCreateResult);
  assert.deepStrictEqual(testNull['getValue' + typeName](), expectedGetValueResult);
});
