const fs = require('fs');

const origMkdir = fs.mkdir;
const origMkdirSync = fs.mkdirSync;

fs.mkdir = function(path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  origMkdir.call(fs, path, options, (err) => {
    if (err && (err.code === 'EPERM' || err.code === 'EEXIST')) {
      try {
        origMkdirSync.call(fs, path, options);
        if (callback) callback(null);
        return;
      } catch (e2) {
        if (fs.existsSync(path)) {
          if (callback) callback(null);
          return;
        }
      }
    }
    if (callback) callback(err);
  });
};

fs.mkdirSync = function(path, options) {
  try {
    return origMkdirSync.call(fs, path, options);
  } catch (err) {
    if (err && (err.code === 'EPERM' || err.code === 'EEXIST') && fs.existsSync(path)) {
      return;
    }
    throw err;
  }
};

if (fs.promises && fs.promises.mkdir) {
  const origPromisesMkdir = fs.promises.mkdir;
  fs.promises.mkdir = async function(path, options) {
    try {
      return await origPromisesMkdir.call(fs.promises, path, options);
    } catch (err) {
      if (err && (err.code === 'EPERM' || err.code === 'EEXIST')) {
        try {
          origMkdirSync.call(fs, path, options);
          return;
        } catch (e2) {
          if (fs.existsSync(path)) {
            return;
          }
        }
      }
      throw err;
    }
  };
}
