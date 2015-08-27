'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var env = require('get-env')({
  test: 'test'
});


var app = module.exports = loopback();

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:

var staticPath = null;

if (env !== 'prod') {
  staticPath = path.resolve(__dirname, '../client/app/');
  console.log("Running app in development mode");
} else {
  staticPath = path.resolve(__dirname, '../dist/');
  console.log("Running app in prodction mode");
}

app.use(loopback.static(staticPath));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
