angular.module('controllers/mainController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope', function($scope) {
		$scope.bacon = 'bacon'
		
	}]);
