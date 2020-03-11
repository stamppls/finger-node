'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TeacherSchema = new Schema({
    finger_id1: {
        type: String,
        required: 'Please fill a Teacher finger_id1',
    },
    finger_id2: {
        type: String,
        required: 'Please fill a Teacher finger_id2',
    },
    teachername: {
        type: String,
        required: 'Please fill a Teacher teachername',
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

mongoose.model("Teacher", TeacherSchema);