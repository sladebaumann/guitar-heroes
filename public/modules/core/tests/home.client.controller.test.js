'use strict';

(function() {
	describe('HomeController tests:', function() {
		//Initialize global variables
		var scope,
			HomeController,
            $location;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		beforeEach(inject(function($controller, $rootScope, _$location_) {
			scope = $rootScope.$new();
            $location = _$location_;

			HomeController = $controller('HomeController', {
				$scope: scope
			});
		}));

		it('should expose the authentication service', function() {
			expect(scope.authentication).toBeTruthy();
		});
	});
})();
