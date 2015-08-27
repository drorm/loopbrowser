angular.module('testController', ['ngRoute'])
.controller('testController', function($scope) {
    
    $scope.gridScope = $scope;
    
    $scope.gridOptions = {
        data: [ { firstName: 'Frank', lastName: 'Zappa' },
                { firstName: 'Giuseppe', lastName: 'Verdi'},
                { firstName: 'Mos',  lastName: 'Def' }],
        columnDefs: [{
            field: 'firstName',
            displayName: 'First' },
        {   field: 'lastName',
            displayName: 'Last' }, 
        {
            field: 'edit',
            cellTemplate: '<button id="editBtn" type="button" class="btn-small glyphicon glyphicon-pencil" ng-click="grid.appScope.editUser(row.entity)" ></button> '
        }]
    };

    $scope.editUser = function(data) {
      alert('Edit ' + data.firstName + ' ' + data.lastName);
    }
});
