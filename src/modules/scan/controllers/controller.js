'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Scan = mongoose.model('Scan'),
    Student = mongoose.model('Student'),
    Classroom = mongoose.model('Classroom'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var query = {};
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    Scan.find({}, {}, query, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.createReportGroup = function (req, res) {
    var newScan = new Scan(req.body);
    newScan.createby = req.user;
    newScan.timeScan = Date.now();
    newScan.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Scan.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updScan = _.extend(req.data, req.body);
    updScan.updated = new Date();
    updScan.updateby = req.user;
    updScan.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.getExistStudent = function (req, res, next) {
    Student.findOne({ $or: [{ finger_id1: req.body.finger_id }, { finger_id2: req.body.finger_id }] }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (data) {
                req.student = data;
                next();
            } else {
                return res.status(400).send({
                    status: 400,
                    message: "Student not found!!"
                })
            }
        }
    })
}

exports.getClassByTime = function (req, res, next) {
    var hour = (new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).getHours());
    var min = (new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).getMinutes());
    var day = new Date().getDay();
    var time = parseFloat(hour.toString() + "." + min.toString());
    if(day == 1){
        day = "จันทร์"
    }else if(day == 2){
        day = "อังคาร"
    }else if(day == 3){
        day = "พุธ"
    }else if(day == 4){
        day = "พฤหัสบดี"
    }else{
        day = "ศุกร์"
    }

    // console.log(day);
    Classroom.findOne({ group_name: req.student.group_name }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage
            })
        } else {
            if (data) {
                // console.log("DayOfWeek: ",data.DayOfWeek);
                // console.log("Day: ",day);
                if (data.timestart < time && time > 8 && data.timeend > time && data.DayOfWeek === day || data.timestart < time && time > 13) {
                    req.classroom = data;
                    console.log(req.classroom);
                    next();
                } else {
                    return res.status(400).send({
                        status: 400,
                        message: "Time not found"
                    })
                }
            } else {
                return res.status(400).send({
                    status: 400,
                    message: "Classroom not found"
                })
            }
        }
    })
}
