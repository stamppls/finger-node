'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ClassroomSchema = new Schema({
    roomid:{
        type: String,
        required: "Please roomid"
    },
    year:{
        type: String,
        required: "Please year"
    },
    term:{
         type: String,
         required: "Please term"    
    },
    DayOfWeek:{
        type: String,
        required: "Please DayOfWeek" 
    },
    timestart:{
        type: String,
        required: "Please timestart" 
    },
    timeend:{
        type: String,
        required: "Please timeend" 
    },
    subjectname:{
        type: String,
        required: "Please subjectname" 
    },
    subjectid:{
        type: String,
        required: "Please subjectid" 
    },
    teachername:{
        type: String,
        required: "Please teachername" 
    },
    group_name:{
        type: String,
        required: "Please group_name" 
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

mongoose.model("Classroom", ClassroomSchema);