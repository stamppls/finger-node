'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Classroom = mongoose.model('Classroom');

var credentials,
    token,
    mockup;

describe('Classroom CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            roomid: "23901",
            year: "2564",
            term: "2",
            DayOfWeek: "จันทร์",
            timestart: "8.30",
            timeend: "24.00",
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

    it('should be Classroom get use token', (done)=>{
        request(app)
        .get('/api/classrooms')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            var resp = res.body;
            done();
        });
    });

    it('should be Classroom get by id', function (done) {

        request(app)
            .post('/api/classrooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/classrooms/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.roomid, mockup.roomid);
                        assert.equal(resp.data.year, mockup.year);
                        assert.equal(resp.data.term, mockup.term);
                        assert.equal(resp.data.DayOfWeek, mockup.DayOfWeek);
                        assert.equal(resp.data.timestart, mockup.timestart);
                        assert.equal(resp.data.timeend, mockup.timeend);
                        assert.equal(resp.data.subject, mockup.subject);
                        assert.equal(resp.data.group_name, mockup.group_name);
                        done();
                    });
            });

    });

    it('should be Classroom post use token', (done)=>{
        request(app)
            .post('/api/classrooms')
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

    it('should be classroom put use token', function (done) {

        request(app)
            .post('/api/classrooms')
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
                                    time: "7.45"
                                },
                                {
                                    time: "7.59"
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
                    timeend: "11.0",
                    subject: "คณิตศาสตร์",
                    group_name: "CSS45941N"
                }
                request(app)
                    .put('/api/classrooms/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.roomid, update.roomid);
                        assert.equal(resp.data.year, update.year);
                        assert.equal(resp.data.term, update.term);
                        assert.equal(resp.data.DayOfWeek, update.DayOfWeek);
                        assert.equal(resp.data.timestart, update.timestart);
                        assert.equal(resp.data.timeend, update.timeend);
                        assert.equal(resp.data.subject, update.subject);
                        assert.equal(resp.data.group_name, update.group_name);
                        done();
                    });
            });

    });

    it('should be classroom delete use token', function (done) {

        request(app)
            .post('/api/classrooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/classrooms/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be classroom get not use token', (done)=>{
        request(app)
        .get('/api/classrooms')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    it('should be classroom post not use token', function (done) {

        request(app)
            .post('/api/classrooms')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be classroom put not use token', function (done) {

        request(app)
            .post('/api/classrooms')
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
                    .put('/api/classrooms/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be classroom delete not use token', function (done) {

        request(app)
            .post('/api/classrooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/classrooms/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Classroom.deleteMany().exec(done);
    });

});