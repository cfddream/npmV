var npm = require('npm');

exports.list = list;

var npmconf = {
  global: true,
  long: true,
  json: true,
  //parseable: true,
  depth: 0,
  argv: {},
  _exit: true
};

function errorHandler(er) {}

!function root(cb) {
  npmconf.argv = {
    remain: [],
    cooked: [ 'root', '--global' ],
    original: [ 'root', '-g' ]
  };
  npm.load(npmconf, function (er) {
    if (er) errorHandler(er);
    npm.commands.root([], function (er, data, lite) {
      if (er) errorHandler(er);
      //cb(data);
      exports.rootPath = data;
    });
  });
}();

function list(cb) {
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

exports.package = package;

function package(v, cb) {
  cb();
};

// test
if (require.main === module) {
  list(console.dir);
  //process.exit(0);
}
