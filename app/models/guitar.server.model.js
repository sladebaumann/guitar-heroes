'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Guitar Schema
 */
var GuitarSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Guitar must have a name'
    },
    head: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    neck: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    body: {
        type: Schema.Types.ObjectId,
        ref: 'Part'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: 'Guitar must have a creator'
    }
});

mongoose.model('Guitar', GuitarSchema);
