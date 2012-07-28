
/*
 * GET home page.
 */
var npmV = require('../lib/npmV.js')
  , fs = require('fs');

exports.index = function(req, res){

  npmV.list(function (data) {
    res.render('index', {
      title: 'npmV is a visual interface for NPM.',
      packages: data.dependencies,
      path: npmV.rootPath = npmV.rootPath || data.path,
      realPath: data.path,
      depth: 0
    });
  });

};

exports.package = function (req, res) {
  var package = req.params.package
    , version = req.params.version;

  var fullpackage = package + '@' + version;

  npmV.package(fullpackage, function (data) {
    var packagejson = require(npmV.rootPath + '/' + package + '/package.json');

    res.render('package', {
      title: 'npmV is a visual interface for NPM.',
      name: fullpackage,
      packages: packagejson.dependencies || [],
      path: npmV.rootPath + '/' + package + '/node_modules',
      //packages: data.dependencies,
      //path: data.path,
      //realPath: data.path,
      depth: 1
    });

  });

};
