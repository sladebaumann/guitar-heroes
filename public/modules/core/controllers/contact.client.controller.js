'use strict';

angular.module('core').controller('ContactController', ['$scope', '$http',
	function($scope, $http) {
        $scope.success = false;
        $scope.error = false;
        $scope.submit = function() {
            var emailBody = '<div>Name: ' + $scope.user.name + '</div>' +
                '<div>Email: ' + $scope.user.email + '</div>' +
                '<div>Message: ' + $scope.user.body + '</div>' +
                '<div>Date: ' + (new Date()).toString() + '</div>';

            var data = {
                'From': $scope.user.email,
                'To': 'guitarheroes@gmail.com',
                'HtmlBody': emailBody,
                'Subject': 'New contact form submission by ' + $scope.user.name
            };

            console.log(data);

            $http({
                url: 'https://api.postmarkapp.com/email',
                data: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Postmark-Server-Token': '8569dcd45-6a1a-4e7b-ae75-ea37629de4'
                }
            }).
                success(function (data) {
                    $scope.success = true;
                    $scope.user = {};
                }).
                error(function (data) {
                    $scope.error = true;
                });
        };
    }
]);
