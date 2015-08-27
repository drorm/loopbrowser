
// Declare app level module which depends on views, and components
angular.module('loopBrowser', [
  'ngRoute',
  'ngResource',
	'ui.bootstrap',
	'ui.bootstrap.modal',
	'ui.grid',
  'loopBrowser.smodel',
  'loopBrowser.models',
  'ngMessages',
  'loopBrowser.layout',
  'formlyBootstrap',
  'formly'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    otherwise({redirectTo: '/'});
}])
.run(function($rootScope, $http) {
$rootScope.baseUrl = '/api/'; //TODO

/**
 * Get the model/database table list and properties/fields for the app.
 */

 //TODO migrate to a service
$rootScope.getModels = function (cb) {
  /* TODO: optionally cache
  if($rootScope.loopModels) {
    cb($rootScope.loopModels);
  } else {
  */
    $http.get($rootScope.baseUrl + 'model').success(function(data) {
      $rootScope.loopModels = data;
      cb($rootScope.loopModels);
    })
    .error(function(data, status, headers, config) {
      console.log(status);
    });
  //}
};
});

