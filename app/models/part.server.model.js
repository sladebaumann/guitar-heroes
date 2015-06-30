'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Part Schema
 */
var PartSchema = new Schema({
    brand: {
        type: String,
        default: '',
        trim: true,
        required: 'Part must have a brand'
    },
    range: {
        type: String,
        default: '',
        trim: true,
        required: 'Part must have a range'
    },
    'type': {
        type: String,
        default: '',
        trim: true,
        required: 'Part must have a type'
    }
});

PartSchema.path('type').validate(function(value) {
    return /head|neck|body/.test(value);
});

mongoose.model('Part', PartSchema);
