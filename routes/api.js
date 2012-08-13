var path = require('path');
var join = path.join;
var md5 = require('../lib/util').md5;
var node = require('../models/node');

var cache = {};

module.exports.package = function (req, res, next) {
  var node_path = ''
    , hash;
  if (!req.params.package && !req.params.hash) {
    node_path = node.globalDir;
    hash = md5(node_path);
    cache[hash] = node_path;
  } else {
    var package = req.params.package
      , hash = req.params.hash;

    if (package && !hash) {
      node_path = join(node.globalDir, package);
      hash = md5(node_path);
    }

    if (!(hash in cache)) {
      cache[hash] = node_path = join(node.globalDir, package);
    }
    else {
      node_path = join(cache[hash], 'node_modules', package);
      hash = md5(node_path);
    }

  }

  node.list(node_path, function (data) {
    var dependencies = data.dependencies;
    if (dependencies && 'undefined' in dependencies && typeof dependencies['undefined'] === 'object') {
      delete dependencies['undefined'];
    }
    data.node_path = node_path;
    data._hash = hash;
    res.json(200, data);
  });
};
