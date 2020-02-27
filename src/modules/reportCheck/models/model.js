'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReportcheckSchema = new Schema({
    roomid: {
        type: String,
        required: 'Please fill a roomid',
    },
    year: {
        type: String,
        required: 'Please fill a year',
    },
    term: {
        type: String,
        required: 'Please fill a term',
    },
    student: [{
        studentid: {
            type: String,
            required: 'Please fill a studentid',
        },
        firstname: {
            type: String,
            required: 'Please fill a firstname',
        },
        lastname: {
            type: String,
            required: 'Please fill a lastname',
        },
        timeScan: [{
            time: {
                type: String,
                required: 'Please fill a time',
            },
            date: {
                type: String,
                required: 'Please fill a date',
            },
        }],
    }],
    DayOfWeek: {
        type: String,
        required: 'Please fill a DayOfWeek',
    },
    timestart: {
        type: String,
        required: 'Please fill a timestart',
    },
    timeend: {
        type: String,
        required: 'Please fill a timeend',
    },
    subject: {
        type: String,
        required: 'Please fill a subject',
    },
    group_name: {
        type: String,
        required: 'Please fill a group_name',
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

mongoose.model("Reportcheck", ReportcheckSchema);