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

exports.create = function (req, res) {
    var newScan = new Scan(req.body);
    newScan.createby = req.user;
    newScan.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data,
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
    // console.log("getExistStudent")
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
    var asiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    var bkkHourNow = new Date(new Date(asiaTime).getTime()).getHours();
    var bkkMinNow = new Date(new Date(asiaTime).getTime()).getMinutes();
    var bkkTimeNow = parseFloat(bkkHourNow.toString() + "." + bkkMinNow.toString());

    var bkkDateNow = new Date(asiaTime);
    var DayOfWeek = bkkDateNow.getDay();

    var bkkday = bkkDateNow.getDate();
    var bkkmonth = bkkDateNow.getUTCMonth() + 1;
    var bkkyear = bkkDateNow.getUTCFullYear();
    var datebkkNow = bkkday + "/" + bkkmonth + "/" + bkkyear;

    if (DayOfWeek == 1) {
        DayOfWeek = "จันทร์"
    } else if (DayOfWeek == 2) {
        DayOfWeek = "อังคาร"
    } else if (DayOfWeek == 3) {
        DayOfWeek = "พุธ"
    } else if (DayOfWeek == 4) {
        DayOfWeek = "พฤหัสบดี"
    } else if (DayOfWeek == 5) {
        DayOfWeek = "ศุกร์"
    } else if (DayOfWeek == 6) {
        DayOfWeek = "เสาร์"
    } else {
        DayOfWeek = "อาทิตย์"
    }


    Classroom.findOne({ group_name: req.student.group_name }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage
            })
        } else {
            if (data) {
                var timebeforstart = (parseFloat(data.timestart) - 1).toFixed(2);
                var timeend = parseFloat(data.timeend);
                // console.log(bkkTimeNow+ ':' +timebeforstart)
                // console.log(bkkTimeNow+ ':' +timeend)
                // console.log(data.DayOfWeek+ ':' +DayOfWeek)
                if (bkkTimeNow >= timebeforstart && bkkTimeNow <= timeend && data.DayOfWeek === DayOfWeek) {
                    var ScanNew = {
                        finger_id: req.body.finger_id,
                        time: bkkTimeNow,
                        date: datebkkNow,
                        subjectid: data.subjectid,
                        group_name: data.group_name
                    }
                    req.body = ScanNew;
                    req.classroom = data;
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

