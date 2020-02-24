'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ScanSchema = new Schema({
    finger_id1: {
        type: String,
        required: 'Please fill a Scan finger_id1',
    },
    finger_id2: {
        type: String,
        required: 'Please fill a Scan finger_id2'
    },
    timeScan:{
        type: Number,
        required: 'Please fill a Scan timeScan'
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

mongoose.model("Scan", ScanSchema);