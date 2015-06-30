'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	parts = require('../controllers/parts.server.controller.js');

module.exports = function(app) {
	// Creator Routes
	app.route('/parts/:type')
		.get(parts.list);


	app.route('/parts/')
		.post(users.requiresLogin, parts.create);

	app.route('/parts/:partId')
		.get(parts.read)
		.put(users.requiresLogin, parts.hasAuthorization, parts.update)
		.delete(users.requiresLogin, parts.hasAuthorization, parts.delete);

	// Finish by binding the article middleware
	app.param('partId', parts.partByID);
};
