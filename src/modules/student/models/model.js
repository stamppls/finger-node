'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StudentSchema = new Schema({
    studentid: {
        type: String,
        required: 'Please fill a Student studentid'
    },
    firstname: {
        type: String,
        required: 'Please fill a Student firstname'
    },
    lastname: {
        type: String,
        required: 'Please fill a Student lastname'
    },
    finger_id1: {
        type: String,
        required: 'Please fill a Student finger_id1'
    },
    finger_id2: {
        type: String,
        required: 'Please fill a Student finger_id2'
    },
    phonenumber: {
        type: String
    },
    group_name: {
        type: String,
        required: 'Please fill a Student group_name'
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

mongoose.model("Student", StudentSchema);