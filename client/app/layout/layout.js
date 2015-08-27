angular.module('loopBrowser.layout', ['ngRoute'])
.controller('Layout', function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
});


