'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', '$location', 'Authentication',
    function($scope, $http, $location, Authentication) {
        $scope.authentication = Authentication;
        //TODO: Exclude /signin
        $scope.currentPage = $location.$$path;

        // Update the login URL after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.currentPage = $location.$$path;
        });
    }
]);
