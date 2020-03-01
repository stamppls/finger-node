'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ScanSchema = new Schema({
    finger_id: {
        type: String,
        required: 'Please fill a Scan finger_id',
    },
    time: {
        type: String,
        required: 'Please fill a Scan time',
    },
    date: {
        type: String,
        required: 'Please fill a Scan time',
    },
    subjectname:{
        type: String,
        required: 'Please fill a Scan subjectname',
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