
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , routes = require('./routes/index')
  , api = require('./routes/api')
  , util = require('./lib/util')
  , http = require('http')
  , path = require('path');

var app = express();

var static_dir = path.join(__dirname, 'public');

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.locals({
  title: 'npmV is an "easy-to-use" visual interface for NPM.'
});

app.configure('development', function() {
  app.use(stylus.middleware({
      src: static_dir
    , dest: static_dir
    , compile: util.compileMethod
    })
  );
  app.use(express.static(static_dir, { maxAge: 0 }));
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

app.configure('production', function () {
  var one_year = 1000 * 60 * 60 * 24 * 30;
  app.use(express.static(static_dir, {
    maxAge : one_year
  }));
  app.use(express.errorHandler());
  app.set('view cache', true);
});

app.get('/', routes.index);

app.get('/package/:package?/:hash?', routes.package);


// Api
// ----------------------------------------------------------------------------

app.get('/api/package/:package?/:hash?', api.package);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
