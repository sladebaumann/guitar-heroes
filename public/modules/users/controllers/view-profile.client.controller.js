'use strict';

angular.module('users').controller('ViewProfileController',
    ['$scope', '$http', '$location', 'Authentication',
     function ($scope, $http, $location, Authentication) {
         $scope.user = Authentication.user;

         $http.get('/guitars/creator/' + $scope.user._id).success(function (data) {
             $scope.guitars = data;
             console.log(data);
         });
     }
    ]);
