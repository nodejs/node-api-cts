// napiVersion is a positive integer
if (typeof napiVersion !== 'number' || napiVersion < 1 || !Number.isInteger(napiVersion)) {
  throw new Error('Expected a global napiVersion that is a positive integer');
}
