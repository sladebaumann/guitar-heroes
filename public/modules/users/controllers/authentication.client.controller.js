'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
	function($scope, $http, $location, $stateParams, Authentication) {
		$scope.authentication = Authentication;

        // If user is signed in then redirect back home
		if ($scope.authentication.user) {
            if ($stateParams.id){
                $location.path($stateParams.id);
            } else {
                $location.path('/');
            }
        }

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the page the user came from
                if ($stateParams.id){
                    $location.path($stateParams.id);
                } else {
                    $location.path('/');
                }
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
