/*
* @module  Display the schema for the models
*/

angular.module('loopBrowser.models', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
'use strict';
/*
* Route to show the list of loopback models/db tables
*/
  $routeProvider.when('/', {
    templateUrl: 'smodel/models.html',
    controller: 'SmodelCtrl'
  });
}])


/*
* Controller to show the list of loopback models/db tables in the app and their structure
*/
.controller('SmodelCtrl', function ($scope, $http, $rootScope) {
  $rootScope.getModels(function(models) {
    $scope.smodel = models;
  });
});

