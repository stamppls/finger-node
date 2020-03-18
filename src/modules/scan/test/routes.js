'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Scan = mongoose.model('Scan'),
    Student = mongoose.model('Student'),
    Classroom = mongoose.model('Classroom'),
    Reportcheck = mongoose.model('Reportcheck'),
    Teacher = mongoose.model('Teacher');

var credentials,
    token,
    mockup,
    mockupTeacher;

describe('Scan CRUD routes tests', function () {
    before(function (done) {
        mockup = {
            finger_id: "3"
            // phonenumber: "0957594433"
        };

        mockupTeacher = new Teacher({
            finger_id1: "3",
            finger_id2: "4",
            phonenumber: "0972984409",
            teachername: "อารจารย์ เฉลิมชัย"
        })
        mockupTeacher.save();

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

    it('should be Scan get use token', (done) => {
        request(app)
            .get('/api/scans')
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

    it('should be Scan get by id', function (done) {

        request(app)
            .post('/api/scans')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/scans/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.notEqual(resp.data.finger_id, null);
                        assert.notEqual(resp.data.time, null);
                        assert.notEqual(resp.data.date, null);
                        assert.notEqual(resp.data.subjectid, null);
                        assert.notEqual(resp.data.group_name, null);
                        done();
                    });
            });

    });

    it('should be Scan post use token', (done) => {
        request(app)
            .post('/api/scans')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                // console.log(res.body);
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.notEqual(resp.data.finger_id, null);
                assert.notEqual(resp.data.time, null);
                assert.notEqual(resp.data.date, null);
                assert.notEqual(resp.data.subjectid, null);
                assert.notEqual(resp.data.group_name, null);
                done();
            });
    });

    xit('should be scan put use token', function (done) {

        request(app)
            .post('/api/scans')
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
                    .put('/api/scans/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.finger_id, mockup.finger_id);
                        assert.notEqual(resp.data.timeScan, null);
                        done();
                    });
            });

    });

    xit('should be scan delete use token', function (done) {

        request(app)
            .post('/api/scans')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/scans/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be scan get not use token', (done) => {
        request(app)
            .get('/api/scans')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be scan post not use token', function (done) {

        request(app)
            .post('/api/scans')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be scan put not use token', function (done) {

        request(app)
            .post('/api/scans')
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
                    .put('/api/scans/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be scan delete not use token', function (done) {

        request(app)
            .post('/api/scans')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/scans/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Scan.deleteMany().exec(done);
    });

});