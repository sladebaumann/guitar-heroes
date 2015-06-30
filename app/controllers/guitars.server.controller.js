'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Guitar = mongoose.model('Guitar'),
    _ = require('lodash');

/**
 * Create a guitar
 */
exports.create = function (req, res) {
    var guitar = new Guitar(req.body);

    guitar.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(guitar);
        }
    });
};

/**
 * Get guitar by ID
 */
exports.guitarById = function (req, res) {
    Guitar
        .findOne({_id: mongoose.Types.ObjectId(req.params.guitarId)})
        .exec(function (err, guitar) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(guitar);
            }
        });
};

/**
 * Update a guitar
 */
exports.updateGuitar = function (req, res) {
    var guitar = req.body;

    Guitar.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.guitarId), {
            $set: {
                head: guitar.head,
                neck: guitar.neck,
                body: guitar.body,
                name: guitar.name
            }
        },
        function (err, guitar) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(guitar);
            }
        });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
    var article = req.article;

    article.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};

/**
 * List of guitars
 */
exports.list = function (req, res) {
    Guitar
        .find()
        .populate('part head')
        .populate('part neck')
        .populate('part body')
        .exec(function (err, guitars) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(guitars);
            }
        });
};

/**
 * Guitars by creator
 */
exports.guitarsByCreator = function (req, res) {
    Guitar
        .find({creator: mongoose.Types.ObjectId(req.params.creatorId)})
        .populate('part head')
        .populate('part neck')
        .populate('part body')
        .exec(function (err, guitars) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(guitars);
            }
        });
};
