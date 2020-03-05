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

    var mockupStudent = {
        finger_id1: '5',
        finger_id2: '6',
        studentid: '459415241005',
        firstname: 'นางสาว ณัฐณิชา',
        lastname: 'สาริยัง',
        group_name: 'CSS45941N',
    }
    student.push(mockupStudent);
    var mockUpScan = [{
        finger_id: '3',
        time: '12:55',
        date: '2/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '4',
        time: '14:00',
        date: '2/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '4',
        time: '13:10',
        date: '9/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '3',
        time: '13:30:',
        date: '9/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '1',
        time: '12:57',
        date: '9/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '5',
        time: '12:45',
        date: '9/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '6',
        time: '13:50',
        date: '9/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    },
    {
        finger_id: '1',
        time: '12:50',
        date: '9/3/2020',
        subjectid: '111-11-1',
        group_name: 'CSS45941N',
    }]
    mockUpScan.forEach(item => {
        scan.push(item);
    })

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
            week7: '',
        }

        var dateBefore;
        var week = 0;
        scan.forEach(scans => {
            if (students.finger_id1 === scans.finger_id || students.finger_id2 === scans.finger_id) {
                if (dateBefore !== scans.date) {
                    week++;
                    if (week == 1) {
                        students.week1 = scans.time;
                    } else if (week == 2) {
                        students.week2 = scans.time;
                    } else if (week == 3) {
                        students.week3 = scans.time;
                    } else if (week == 4) {
                        students.week4 = scans.time;
                    } else if (week == 5) {
                        students.week5 = scans.time;
                    } else if (week == 6) {
                        students.week6 = scans.time;
                    } else {
                        students.week7 = scans.time;
                    }
                }
                dateBefore = scans.date;
            }
        })
        report.student.push(students)
    })

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
    ws.cell(5, 9).string('สัปดาห์ที่ 1').style(StyleStudents);
    ws.cell(5, 10).string('สัปดาห์ที่ 2').style(StyleStudents);
    ws.cell(5, 11).string('สัปดาห์ที่ 3').style(StyleStudents);
    ws.cell(5, 12).string('สัปดาห์ที่ 4').style(StyleStudents);
    ws.cell(5, 13).string('สัปดาห์ที่ 5').style(StyleStudents);
    ws.cell(5, 14).string('สัปดาห์ที่ 6').style(StyleStudents);
    ws.cell(5, 15).string('สัปดาห์ที่ 7').style(StyleStudents);

    var i = 6;
    var number = 1;
    report.student.forEach(student => {
        // console.log(student);
        ws.cell(i, 3).number(number).style(StyleStudents);
        ws.cell(i, 4, i, 5, true).string(student.studentid).style(StyleStudents);
        ws.cell(i, 6, i, 8, true).string(student.firstname + ' ' + student.lastname).style(StyleStudents)
        ws.cell(i, 9).string(student.week1).style(StyleStudents)
        ws.cell(i, 10).string(student.week2).style(StyleStudents)
        ws.cell(i, 11).string(student.week3).style(StyleStudents)
        ws.cell(i, 12).string(student.week4).style(StyleStudents)
        ws.cell(i, 13).string(student.week5).style(StyleStudents)
        ws.cell(i, 14).string(student.week6).style(StyleStudents)
        ws.cell(i, 15).string(student.week7).style(StyleStudents)
        i++;
        number++;
    })

    var FileName = report.group_name;
//     wb.writeToBuffer('ExcelFile.xlsx').then((buffer) => {
//         res.jsonp({
//             status: 200,
//             data: buffer,
//         });
//     })
    wb.write(FileName + '.xlsx', res);


    // wb.write(FileName + '.xlsx', function (err, stats) {
    //     if (err) {
    //         return res.status(400).send({
    //             status: 400,
    //             message: errorHandler.getErrorMessage(err)
    //         });
    //     } else {
    //         res.attachment(FileNam + '.xlsx');
    //         // res.jsonp({
    //         //     status: 200,
    //         //     data: stats,
    //         // });
    //     }
    // });
}

