var fs = require('fs');
var npm = require('npm');
// npm globalDir
var globalDir;

var global = this;

var npmconf = {
  global: true,
  long: true,
  json: true,
  //parseable: true,
  depth: 0,
  argv: {},
  _exit: true
};

!function getGlobalRoot() {
  npmconf.argv = {
    remain: [],
    cooked: [ 'root', '--global' ],
    original: [ 'root', '-g' ]
  };
  npm.load(npmconf, function (er) {
    if (er) errorHandler(er);
    npm.commands.root([], function (er, data, lite) {
      if (er) errorHandler(er);
      module.exports.globalDir = globalDir = data;
    });
  });
}();

// list modules
module.exports.list = function (path, cb) {
  if (path === globalDir) {
    npmconf.argv = {
      remain: [],
      cooked: [ 'list', '--global' ],
      original: [ 'list', '-g' ]
    };
    npm.load(npmconf, function (er) {
      if (er) errorHandler(er);
      npm.commands.list([], function (er, data, lite) {
        if (er) errorHandler(er);
        cb(data);
      });
    });
  }
  else {
    global.package(path, cb);
  }
};

// package
module.exports.package = function (path, cb) {
  var packageJSON = require(path + '/package.json')
    , dependencies = packageJSON.dependencies;

  if (dependencies && Object.keys(dependencies).length) {
    fs.exists(path + '/node_modules', function (exists) {
      if (exists) {
        fs.readdir(path + '/node_modules', function (err, files) {
          if (err) throw err;
          var i = 0, l = files.length;
          for (; i < l; ++i) {
            if (files[i] in dependencies) {
              dependencies[files[i]] += ' &radic;';
            }
          }
          cb(packageJSON);
        });
      }
      else {
        cb(packageJSON);
      }
    });
    return;
  }
  cb(packageJSON);
};

module.exports.system = function () {
};
