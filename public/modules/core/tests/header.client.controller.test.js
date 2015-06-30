'use strict';

(function () {
    describe('HeaderController tests:', function () {
        //Initialize global variables
        var $scope,
            HeaderController,
            $location;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function ($controller, $state, $rootScope, _$location_) {
            $scope = $rootScope.$new();
            $location = _$location_;
            $scope.$state = $state;

            HeaderController = $controller('HeaderController', {
                $scope: $scope
            });
        }));

        it('should expose the authentication service', function () {
            expect($scope.authentication).toBeTruthy();
        });
    });
})();
