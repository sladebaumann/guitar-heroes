'use strict';

//Articles service used for communicating with the creator REST endpoints
angular.module('creator').factory('Parts', ['$resource',
	function($resource) {
		return $resource('creator/:partId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
