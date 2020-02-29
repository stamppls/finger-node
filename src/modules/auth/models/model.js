'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AuthSchema = new Schema({
    username: {
        type: String,
        required: 'Please fill a Auth username',
    },
    password: {
        type: String,
        required: 'Please fill a Auth password',
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

mongoose.model("Auth", AuthSchema);