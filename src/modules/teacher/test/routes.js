'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Teacher = mongoose.model('Teacher');

var credentials,
    token,
    mockup;

describe('Teacher CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            finger_id1: '1',
            finger_id2: '2',
            phonenumber: '0957594433',
            teachername: 'อาจารย์ เฉลิมชัย',

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

    it('should be Teacher get use token', (done)=>{
        request(app)
        .get('/api/teachers')
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

    it('should be Teacher get by id', function (done) {

        request(app)
            .post('/api/teachers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/teachers/' + resp.data._id)
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
                        assert.equal(resp.data.teachername, mockup.teachername);
                        done();
                    });
            });

    });

    it('should be Teacher post use token', (done)=>{
        request(app)
            .post('/api/teachers')
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
                assert.equal(resp.data.teachername, mockup.teachername);
                done();
            });
    });

    it('should be teacher put use token', function (done) {

        request(app)
            .post('/api/teachers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    finger_id1: '3',
                    finger_id2: '4',
                    teachername: 'อาจารย์ ยิ่งศักดิ์'
                }
                request(app)
                    .put('/api/teachers/' + resp.data._id)
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
                        assert.equal(resp.data.teachername, update.teachername);
                        done();
                    });
            });

    });

    xit('should be teacher delete use token', function (done) {

        request(app)
            .post('/api/teachers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/teachers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be teacher get not use token', (done)=>{
        request(app)
        .get('/api/teachers')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    xit('should be teacher post not use token', function (done) {

        request(app)
            .post('/api/teachers')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be teacher put not use token', function (done) {

        request(app)
            .post('/api/teachers')
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
                    .put('/api/teachers/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be teacher delete not use token', function (done) {

        request(app)
            .post('/api/teachers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/teachers/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Teacher.deleteMany().exec(done);
    });

});