/* 
* @module -- smodel, a loopback model that corresponds to a database table.
* Display a grid with rows from the table and provide Crud operations:
* Insert, Update, Delete
*/

/* 
* Insert options for the modal for insert/update. See http://angular-ui.github.io/bootstrap/#/modal for details
*/
insertOpts = {
  templateUrl: "smodel/dialog.html",
  controller: 'insertUpdateController',
  backdrop: true,
  backdropClick: true,
  dialogFade: false,
  keyboard: true
};


/*
* @module  Angular module for loopback models
*/

angular.module('loopBrowser.smodel', ['ngRoute', 'formly', 'formlyBootstrap'])
.config(['$routeProvider', 'formlyConfigProvider', function($routeProvider, formlyConfigProvider) {
'use strict';
/*
* Route to show a single loopback model/db table
*/
  $routeProvider.when('/smodel/:smodelId', {
  		templateUrl: 'smodel/smodel-detail.html',
  		controller: 'SmodelDetailCtrl'
  })
  .when('/smodel', {
    templateUrl: 'smodel/smodel.html',
    controller: 'SmodelCtrl'
  });

/*
* Set up formly validation error messages that display after focus on input field
*/
  formlyConfigProvider.setWrapper({
    name: 'validation',
    types: ['input'],
    template:
      '<formly-transclude></formly-transclude>' +
        '<div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="error-messages">' +
          '<div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>' +
            '</div>',
  });

  formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
}])

/**
* Controller to show a single loopback models/db table data
*/
.controller('SmodelDetailCtrl', ['$scope', '$http', '$routeParams', '$modal','$rootScope',
    '$resource',
  	function($scope, $http, $routeParams, $modal, $rootScope, $resource) {
      /*
      * Define the columns, specifically add a column for remove, edit a row
      */
      var columnDefs = [
        { name: 'actions', displayNam: 'Actions', cellTemplate: 
          /*jshint multistr: true */
          '<button type="button" ng-click="grid.appScope.gridScope.remove(row)" title="Delete"><span class="glyphicon glyphicon-remove"></span> </button> \
          <button type="button" ng-click="grid.appScope.gridScope.update(row)" title="Update"><span class="glyphicon glyphicon-pencil"></span> </button>'
                      
            //TODO: <button id="editBtn" type="button" class="btn-small glyphicon glyphicon-pencil" ng-click="grid.appScope.gridScope.editUser(row.entity)" ></button> \
      }
      ];
      //The smodelId is the name of the model
  		$scope.smodelId = $routeParams.smodelId;
  		var url = $rootScope.baseUrl + $scope.smodelId +
        's';//TODO figure out the path from the api
      //Add support for update/PUT operations
      $scope.Model = $resource(url + '/:id', 
                               {id:'@id'},   
                               { update: {
                                 method: 'PUT'
                               }});
      // Get the rows in the model and display them in the grid
      var rows = $scope.Model.query(function() {
        //Get the struture, fields of this model
        $rootScope.getModels(function(data) {
          var fields = data[$scope.smodelId];
          //Bind the column def
          $scope.gridInfo.columnDefs = createcolumnDefs(fields, columnDefs);
          //Bind the grid data. The grid always displays the
          //data in $scope.gridInfo.rows as it changes
          $scope.gridInfo.rows = rows;
        });
      },
      //Error handling
  		function(data, status, headers, config) {
  			console.log(status);
  			alert(url + status);
  		});

      /**
      * @method addRow
      * Display the modal dialog to add/insert a row
      */
      $scope.addRow = function() {
        var modelName = $scope.smodelId; //model(db table) we're working with
        $scope.operationType = 'Insert';
        $rootScope.getModels(function(models) {
          //get the fields for this model
          var modelFields = models[modelName];
          var formlyFields = getFormFields(modelFields);

          if (formlyFields) {
            $scope.formlyFields = formlyFields;
            insertOpts.scope = $scope;
            insertOpts.resolve =  {
              result: function () {
                return $scope.myForm;
              }
            };
            //open the modal
            var $modalInstance = $modal.open(insertOpts);
          }
        });
    };

    /**
    * Scope of the grid for grid actions 
    */
    $scope.gridScope = {
      /**
      * @method remove Remove a row
      * @param Object row, the grid row we're removing
      */
      remove: function( row ) {
        var id = row.entity.id;//The id of the row
        //Create the angular $resource object
        var delRow = new $scope.Model({id:id});
        //REST remove on loopback
        delRow.$remove(function(){
          var rows = $scope.gridInfo.rows;
          //Now remove from the grid's model
          for(var ii = 0; ii < rows.length; ii++) {
            if(rows[ii].id === id) {
              rows.splice(ii, 1);
              break;
            }
          }
        },
        function(err){
          console.log(err);
          alert(url + ':' + err.statusText);
        });
      },

      /**
      * @method update Update a row
      * @param Object row, the grid row we're removing
      */
      update: function( row ) {
        console.log('update');
        var modelName = $scope.smodelId; //model(db table) we're working with
        var id = row.entity.id;//The id of the row
        //Let the modal that we're doing an update
        $scope.operationType = 'Update'; 
        //Get the struture, fields of this model
        $rootScope.getModels(function(data) {
          var modelFields = data[modelName];
          var formlyFields = getFormFields(modelFields);
          if (formlyFields) {
            //Pass the fields and row data to the modal
            $scope.formlyFields = formlyFields;
            $scope.row = row;
            insertOpts.scope = $scope;
            insertOpts.resolve =  {
              result: function () {
                return $scope.myForm;
              }
            };
            //open the modal
            var $modalInstance = $modal.open(insertOpts);
          }
        });
      }
    };

  $scope.gridInfo = {
    rows: []
  };

}])




/**
 * @method createcolumnDefs -- create the column definitions for the form
 * @param fields -- the fields in this model
 * @param columnDefs -- the default columnDefs for a form
 */
function createcolumnDefs(fields, columnDefs) {
  for (var field in fields) {
    columnDefs.push( { field: field, displayName: field });
  }
  return(columnDefs);
}

/**
 * @method getFormFields -- filter the modelFields to only include appropriate fields for 
 * insert/update
 * @param modelFields -- the fields in the model
 */

function getFormFields(modelFields) {
  //copy the fields
  var formlyFields = [];

  //loopback types are: string number boolean object array date buffer geopoint
  for (var key in modelFields) {
    //Except the ones that getpopulated automatically
    if((key !== 'createdAt') && (key !== 'updatedAt') && (key !== 'id')) {
      var formField = angular.copy(modelFields[key]);

      //Default field set up
      var formlyField = {
        key: key,
        type: 'input',
        templateOptions: {
          type: 'text',
          label: key,
          placeholder: key,
          required: formField.required
        }
      };

      //Now let's handle the specific field types
      switch (formField.type) {
        case 'number':
          formlyField.templateOptions.type = formField.type;
        break;
          case 'date':
            formlyField.templateOptions.type = 'date:MM/dd/yyyy';
        break;

        case 'boolean':
          formlyField.type = 'checkbox';
          formlyField.templateOptions.label = key;
        break;

        case 'buffer':
          formlyField.type = 'textarea';
          formlyField.templateOptions.rows = 4;
          formlyField.templateOptions.columns = 15;
        break;

/*
        case 'date':
          formField = {
          "key": "date",
          "type": "datepicker",
          "templateOptions": {
            "label": key,
            "type": "text",
            "datepickerPopup": "dd-MMMM-yyyy"
            }
          };
          break;
*/

        default: 
          break;
      }

      formlyFields.push(formlyField);
    }
  }
  return(formlyFields);
}
