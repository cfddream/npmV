/*
 * GET home page.
 */
var npmv = require('../lib/npmv')
  , path = require('path')
  , join = path.join
  , node = require('../models/node')
  , md5 = require('../lib/util').md5
  , fs = require('fs')
  , cache = {};

exports.index = function(req, res){
  var path = node.globalDir
    , hash = md5(node.globalDir);

  !(hash in cache) && (cache[hash] = path);

  node.list(path, function (data) {
    data._hash = hash;
    data._path = path;
    res.render('index', data);
  });
};

exports.package = function (req, res) {
  var package = req.params.package
    , parentHash = req.params.hash
    , parentPath = cache[parentHash]
    , path = parentPath === node.globalDir
        ? join(parentPath, package)
        : join(parentPath, 'node_modules', package)
    , hash = md5(path);

  !(hash in cache) && (cache[hash] = path);

  node.list(path, function (data) {
    data._hash = hash;
    data._path = path;
    res.render('package', data);
  });
};
