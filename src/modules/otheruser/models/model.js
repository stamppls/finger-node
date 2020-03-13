'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OtheruserSchema = new Schema({

    identificationcode: {
        type: String,
        required: 'Please fill a Otheruser identificationcode',
    },
    firstname: {
        type: String,
        required: 'Please fill a Otheruser firstname',
    },
    lastname: {
        type: String,
        required: 'Please fill a Otheruser lastname',
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Otheruser", OtheruserSchema);