'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    guitars = require('../controllers/guitars.server.controller.js');

module.exports = function (app) {
    // Creator Routes
    app.route('/guitars')
        .get(guitars.list)
        .post(users.requiresLogin, guitars.create);

    app.route('/guitars/:guitarId')
        .get(guitars.guitarById)
        .put(users.requiresLogin, guitars.updateGuitar)
        .delete(users.requiresLogin, guitars.delete);

    app.route('/guitars/creator/:creatorId')
        .get(users.requiresLogin, guitars.guitarsByCreator);
};
