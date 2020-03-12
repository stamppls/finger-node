'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Reportcheck = mongoose.model('Reportcheck'),
    Student = mongoose.model('Student'),
    Scan = mongoose.model('Scan'),
    Classroom = mongoose.model('Classroom');

var credentials,
    token,
    mockup,
    mockupReport;

describe('Reportcheck CRUD routes tests', function () {

    before(function (done) {
        mockupReport = {
            subjectid: '111-11-1',
            group_name: 'CSS45941N'
        }

        mockup = {
            roomid: "23901",
            year: "2564",
            term: "2",
            student: [
                {
                    studentid: "459415241015",
                    firstname: "นาย ภูรี",
                    lastname: "ลิ้มสกุล",
                    timeScan: [
                        {
                            time: "7.45",
                            date: "1/1/2563"
                        },
                        {
                            time: "7.59",
                            date: "8/1/2563"
                        }
                    ]
                },
                {
                    studentid: "459415241015",
                    firstname: "นาง ณัฐนิชา",
                    lastname: "สาริยัง",
                    timeScan: [
                        {
                            time: "7.30",
                            date: "1/1/2563"
                        },
                        {
                            time: "8.23",
                            date: "8/1/2563"
                        }
                    ]
                }
            ],
            DayOfWeek: "อังคาร",
            timestart: "8.30",
            timeend: "11.30",
            subject: "คณิตศาสตร์",
            group_name: "CSS45941N"
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Reportcheck get use token', (done) => {
        request(app)
            .get('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Reportcheck get by id', function (done) {
        request(app)
            .post('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/reportchecks/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, mockup.name);
                        done();
                    });
            });

    });

    it('should be Reportcheck post use token', (done) => {
        request(app)
            .post('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.name, mockup.name);
                done();
            });
    });

    it('should be reportcheck put use token', function (done) {

        request(app)
            .post('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    roomid: "23901",
                    year: "2564",
                    term: "2",
                    student: [
                        {
                            studentid: "459415241015",
                            firstname: "นาย ภูรี",
                            lastname: "ลิ้มสกุล",
                            timeScan: [
                                {
                                    time: "7.45",
                                    date: "1/1/2563"
                                },
                                {
                                    time: "7.59",
                                    date: "8/1/2563"
                                }
                            ]
                        },
                        {
                            studentid: "459415241015",
                            firstname: "นาง ณัฐนิชา",
                            lastname: "สาริยัง",
                            timeScan: [
                                {
                                    time: "7.30",
                                    date: "1/1/2563"
                                },
                                {
                                    time: "8.23",
                                    date: "8/1/2563"
                                }
                            ]
                        }
                    ],
                    DayOfWeek: "อังคาร",
                    timestart: "8.30",
                    timeend: "11.30",
                    subject: "คณิตศาสตร์",
                    group_name: "CSS45941N"
                }
                request(app)
                    .put('/api/reportchecks/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    it('should be reportcheck delete use token', function (done) {

        request(app)
            .post('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/reportchecks/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be reportcheck get not use token', (done) => {
        request(app)
            .get('/api/reportchecks')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be reportcheck post not use token', function (done) {

        request(app)
            .post('/api/reportchecks')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be reportcheck put not use token', function (done) {

        request(app)
            .post('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/reportchecks/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be reportcheck delete not use token', function (done) {

        request(app)
            .post('/api/reportchecks')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/reportchecks/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be Reportcheck get by id', function (done) {

        var classroom = new Classroom(
            {
                roomid: "23901",
                year: "2564",
                term: "2",
                DayOfWeek: "พฤหัสบดี",
                timestart: "8:39",
                timeend: "23:59",
                subjectname: "คณิตศาสตร์",
                subjectid: "111-11-1",
                teachername: "อารจารย์ เฉลิมชัย",
                group_name: "CSS45941N"
            })
        classroom.save();

        var student = new Student({
            finger_id1: "1",
            finger_id2: "2",
            group_name: "CSS45941N",
            studentid: "459415241015",
            firstname: "นาย ภูรี",
            lastname: "ลิ้มสกุล"
        })
        student.save();

        var scan = new Scan({
            finger_id: "1",
            time: "12:50",
            date: "2/3/2020",
            subjectid: "111-11-1",
            group_name: "CSS45941N"
        })
        scan.save();

        request(app)
            .post('/api/report/group')
            .send(mockupReport)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                // assert.equal(resp.status, 200);
                done();
            });
    });

    afterEach(function (done) {
        Reportcheck.deleteMany().exec(done);
    });

});