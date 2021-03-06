'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    request = require('request'),
    Reportcheck = mongoose.model('Reportcheck'),
    Classroom = mongoose.model('Classroom'),
    Student = mongoose.model('Student'),
    Scan = mongoose.model('Scan'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

var xl = require('excel4node');
const xlsx = require("node-xlsx");
const fs = require("fs");

// var jsReportUri = process.env.JSREPORT_URI || 'https://localhost:5489/api/report';

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
    Reportcheck.find({}, {}, query, function (err, datas) {
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
    var newReportcheck = new Reportcheck(req.body);
    newReportcheck.createby = req.user;
    newReportcheck.save(function (err, data) {
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

    Reportcheck.findById(id, function (err, data) {
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
    var updReportcheck = _.extend(req.data, req.body);
    updReportcheck.updated = new Date();
    updReportcheck.updateby = req.user;
    updReportcheck.save(function (err, data) {
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

exports.getSubFromClass = function (req, res, next) {
    Classroom.findOne({ subjectid: req.body.subjectid, group_name: req.body.group_name }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.classroom = data;
            next();
        };
    })
}

exports.getGroupFromStudent = function (req, res, next) {
    Student.find({ group_name: req.body.group_name }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.student = data;
            next();
        };
    })
}

exports.getScan = function (req, res, next) {
    Scan.find({ subjectid: req.body.subjectid, group_name: req.body.group_name }, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.scan = data;
            next();
        };
    })
}

exports.ModifyDataReport = function (req, res) {
    const classroom = req.classroom;
    const student = req.student;
    const scan = req.scan;

    var report = {
        roomid: classroom.roomid,
        year: classroom.year,
        term: classroom.term,
        subjectid: classroom.subjectid,
        subjectname: classroom.subjectname,
        teachername: classroom.teachername,
        group_name: classroom.group_name,
        student: []
    }

    var i = 0;
    student.forEach(students => {
        students = {
            finger_id1: students.finger_id1,
            finger_id2: students.finger_id2,
            studentid: students.studentid,
            firstname: students.firstname,
            lastname: students.lastname,
            week1: '',
            week2: '',
            week3: '',
            week4: '',
            week5: '',
            week6: '',
            week7: ''
        }

        var dateBefore;
        var week = 0;
        var weeks;
        scan.forEach(scans => {
            if (students.finger_id1 === scans.finger_id || students.finger_id2 === scans.finger_id) {
                if (dateBefore !== scans.date) {
                    week++;
                    if (week == 1) {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week1 = weeks;
                    } else if (week == 2) {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week2 = weeks;
                    } else if (week == 3) {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week3 = weeks;
                    } else if (week == 4) {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week4 = weeks;
                    } else if (week == 5) {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week5 = weeks;
                    } else if (week == 6) {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week6 = weeks;
                    } else {
                        weeks = {
                            date: scans.date,
                            time: scans.time
                        }
                        students.week7 = weeks;
                    }
                }
                dateBefore = scans.date;
            }
        })
        report.student.push(students)
    })
    // console.log(report.student);
    // report.student.forEach(student => {
    //     student.week.forEach(week => {
    //         console.log(week);
    //     })
    // })

    //create Workbook,Worksheet
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');
    //Style
    var StyleBorder = wb.createStyle({
        border: {
            left: {
                style: 'thick',
                color: 'black'
            },
            right: {
                style: 'thick',
                color: 'black'
            },
            top: {
                style: 'thick',
                color: 'black'
            },

        }
    });

    var StyleStudents = wb.createStyle({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            left: {
                style: 'thick',
                color: 'black'
            },
            right: {
                style: 'thick',
                color: 'black'
            },
            top: {
                style: 'thick',
                color: 'black'
            },
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });

    ws.cell(3, 3, 3, 15).style(StyleBorder);
    ws.cell(3, 3, 3, 15, true).string('มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ ศูนย์หันตรา').style({
        alignment: {
            horizontal: 'centerContinuous'
        },
    });

    ws.cell(4, 3).string('รหัสวิชา').style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            left: {
                style: 'thick',
                color: 'black'
            },
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 4).string(report.subjectid).style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 5).style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 6).string('ชื่อวิชา').style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 7, 4, 11, true).string(report.subjectname).style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 12).string('ปีการศึกษาที่').style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 13).string(report.year).style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(4, 14).string('ภาคเรียนที่').style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            }
        }
    });
    ws.cell(4, 15).string(report.term).style({
        alignment: {
            horizontal: 'centerContinuous'
        },
        border: {
            bottom: {
                style: 'thick',
                color: 'black'
            },
            right: {
                style: 'thick',
                color: 'black'
            },
        }
    });
    ws.cell(5, 3).string('ลำดับ').style(StyleStudents);
    ws.cell(5, 4, 5, 5, true).string('รหัสประจำตัวนักศึกษา').style(StyleStudents);
    ws.cell(5, 6, 5, 8, true).string('ชื่อ-นามสกุล').style(StyleStudents);


    var i = 6;
    var number = 1;
    var w = 9;
    report.student.forEach(student => {
        // console.log(student);
        ws.cell(i, 3).number(number).style(StyleStudents);
        ws.cell(i, 4, i, 5, true).string(student.studentid).style(StyleStudents);
        ws.cell(i, 6, i, 8, true).string(student.firstname + ' ' + student.lastname).style(StyleStudents);

        ws.cell(5, 9).string(student.week1.date).style(StyleStudents);
        ws.cell(5, 10).string(student.week2.date).style(StyleStudents);
        ws.cell(5, 11).string(student.week3.date).style(StyleStudents);
        ws.cell(5, 12).string(student.week4.date).style(StyleStudents);
        ws.cell(5, 13).string(student.week5.date).style(StyleStudents);
        ws.cell(5, 14).string(student.week6.date).style(StyleStudents);
        ws.cell(5, 15).string(student.week7.date).style(StyleStudents);

        ws.cell(i, 9).string(student.week1.time).style(StyleStudents);
        ws.cell(i, 10).string(student.week2.time).style(StyleStudents);
        ws.cell(i, 11).string(student.week3.time).style(StyleStudents);
        ws.cell(i, 12).string(student.week4.time).style(StyleStudents);
        ws.cell(i, 13).string(student.week5.time).style(StyleStudents);
        ws.cell(i, 14).string(student.week6.time).style(StyleStudents);
        ws.cell(i, 15).string(student.week7.time).style(StyleStudents);
        i++;
        w++;
        number++;
    })

    var FileName = report.group_name;
    wb.write(FileName + '.xlsx', res);
}

