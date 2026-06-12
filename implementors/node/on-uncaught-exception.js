const onUncaughtException = (cb) => {
  process.on('uncaughtException', cb);
};

Object.assign(globalThis, { onUncaughtException });
