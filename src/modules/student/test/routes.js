'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Student = mongoose.model('Student');

var credentials,
    token,
    mockup;

describe('Student CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            finger_id1: "1",
            finger_id2: "2",
            group_name: "CSS45941N",
            studentid: "459415241015",
            firstname: "นาย ภูรี",
            lastname: "ลิ้มสกุล"
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

    it('should be Student get use token', (done) => {
        request(app)
            .get('/api/students')
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

    it('should be Student get by id', function (done) {

        request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/students/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.finger_id1, mockup.finger_id1);
                        assert.equal(resp.data.finger_id2, mockup.finger_id2);
                        assert.equal(resp.data.group_name, mockup.group_name);
                        assert.equal(resp.data.studentid, mockup.studentid);
                        assert.equal(resp.data.firstname, mockup.firstname);
                        assert.equal(resp.data.lastname, mockup.lastname);
                        done();
                    });
            });
    });

    it('should be Student post use token', (done) => {
        request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.finger_id1, mockup.finger_id1);
                assert.equal(resp.data.finger_id2, mockup.finger_id2);
                assert.equal(resp.data.group_name, mockup.group_name);
                assert.equal(resp.data.studentid, mockup.studentid);
                assert.equal(resp.data.firstname, mockup.firstname);
                assert.equal(resp.data.lastname, mockup.lastname);
                done();
            });
    });

    it('should be student put use token', function (done) {

        request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    finger_id1: "3",
                    finger_id2: "4",
                    group_name: "ITS45941N",
                    studentid: "459415241005",
                    firstname: "นางสาว ณัฐณิชา",
                    lastname: "สาริยัง"
                }
                request(app)
                    .put('/api/students/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.finger_id1, update.finger_id1);
                        assert.equal(resp.data.finger_id2, update.finger_id2);
                        assert.equal(resp.data.group_name, update.group_name);
                        assert.equal(resp.data.studentid, update.studentid);
                        assert.equal(resp.data.firstname, update.firstname);
                        assert.equal(resp.data.lastname, update.lastname);
                        done();
                    });
            });

    });

    it('should be student delete use token', function (done) {

        request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/students/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be student get not use token', (done) => {
        request(app)
            .get('/api/students')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be student post not use token', function (done) {

        request(app)
            .post('/api/students')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be student put not use token', function (done) {

        request(app)
            .post('/api/students')
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
                    .put('/api/students/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be student delete not use token', function (done) {

        request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/students/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be Student get by Group', function (done) {

        request(app)
            .post('/api/students')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/student/' + resp.data.group_name)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data[0].finger_id1, mockup.finger_id1);
                        assert.equal(resp.data[0].finger_id2, mockup.finger_id2);
                        assert.equal(resp.data[0].group_name, mockup.group_name);
                        assert.equal(resp.data[0].studentid, mockup.studentid);
                        assert.equal(resp.data[0].firstname, mockup.firstname);
                        assert.equal(resp.data[0].lastname, mockup.lastname);
                        done();
                    });
            });
    });

    afterEach(function (done) {
        Student.deleteMany().exec(done);
    });

});