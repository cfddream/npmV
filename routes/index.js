
/*
 * GET home page.
 */
var npmV = require('../lib/npmV.js');

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
    res.render('package', {
      title: 'npmV is a visual interface for NPM.',
      name: npmV.rootPath + '/' + fullpackage,
      path: '',
      //packages: data.dependencies,
      //path: data.path,
      //realPath: data.path,
      depth: 1
    });
  });

};
