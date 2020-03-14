'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RoomSchema = new Schema({
    roomid: {
        type: String,
        required: 'Please fill a Room roomid',
    },
    year: {
        type: String,
        required: 'Please fill a Room year',
    },
    term: {
        type: String,
        required: 'Please fill a Room term',
    },
    build: {
        type: String,
        required: 'Please fill a Room build',
    },
    floor: {
        type: String,
        required: 'Please fill a Room floor',
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

mongoose.model("Room", RoomSchema);