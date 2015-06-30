'use strict';

// Setting up route
angular.module('creator').config(['$stateProvider',
    function ($stateProvider) {
        // Articles state routing
        $stateProvider
            .state('creator', {
                url: '/creator',
                controller: 'CreatorController',
                templateUrl: 'modules/creator/views/creator.client.view.html'
            })
            .state('creatorLoad', {
                url: '/creator/:guitarId',
                controller: 'CreatorController',
                templateUrl: 'modules/creator/views/creator.client.view.html'
            });
    }
]);
