var path = require('path');
var async = require('async');
var app = require(path.resolve(__dirname, './server'));

var ds = app.dataSources.db;
var models = ds.adapter._models;
var arrModels = Object.keys(ds.adapter._models);

console.log('arr:' +  arrModels);

async.eachSeries(arrModels, function(model, cb) {
  'use strict';
console.log('migrate:' +  model);
  ds.automigrate(model, function(err) {
    if (err)  {
      console.log(err);
    }
    else  {
      console.log('Success:' + model);
    }
    cb();


  });
});

