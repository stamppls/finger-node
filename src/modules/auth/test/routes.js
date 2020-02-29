'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Auth = mongoose.model('Auth');

var credentials,
    token,
    mockup;

describe('Auth CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            username: 'admin02',
            password: 'admin02'
        };
        var auth = new Auth({
            username: 'admin01',
            password: 'admin01'
        });
        auth.save();
        done();
    });

    xit('should be Auth get use token', (done) => {
        request(app)
            .get('/api/auths')
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

    xit('should be Auth get by id', function (done) {

        request(app)
            .post('/api/auths')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/auths/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.username, mockup.username);
                        assert.equal(resp.data.password, mockup.password);
                        done();
                    });
            });

    });

    xit('should be Auth post use token', (done) => {
        request(app)
            .post('/api/auths')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.username, mockup.username);
                assert.equal(resp.data.password, mockup.password);
                done();
            });
    });

    xit('should be auth put use token', function (done) {

        request(app)
            .post('/api/auths')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    username: 'admin02',
                    password: 'admin02finger'
                }
                request(app)
                    .put('/api/auths/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.username, update.username);
                        assert.equal(resp.data.password, update.password);
                        done();
                    });
            });

    });

    xit('should be auth delete use token', function (done) {

        request(app)
            .post('/api/auths')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/auths/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be auth get not use token', (done) => {
        request(app)
            .get('/api/auths')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be auth post not use token', function (done) {

        request(app)
            .post('/api/auths')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be auth put not use token', function (done) {

        request(app)
            .post('/api/auths')
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
                    .put('/api/auths/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be auth delete not use token', function (done) {

        request(app)
            .post('/api/auths')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/auths/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be signup post use token', (done) => {
        var mockupregis = {
            username: 'admin02',
            password: 'admin02'
        }
        request(app)
            .post('/api/auth/signup')
            .send(mockupregis)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.username, mockupregis.username);
                assert.equal(resp.data.password, mockupregis.password);
                done();
            });
    });

    xit('should be signin post use token', (done) => {
        var mockuplogin = {
            username: 'admin01',
            password: 'admin01'
        }
        request(app)
            .post('/api/auth/signin')
            .send(mockuplogin)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.username, mockupregis.username);
                assert.equal(resp.data.password, mockupregis.password);
                assert.notEqual(resp.token, null);
                done();
            });
    });

    afterEach(function (done) {
        Auth.deleteMany().exec(done);
    });

});