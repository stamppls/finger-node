'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Room = mongoose.model('Room');

var credentials,
    token,
    mockup;

describe('Room CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            roomid: '23920',
            year: '2563',
            term: '2',
            build: '23',
            floor: '9',
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

    it('should be Room get use token', (done)=>{
        request(app)
        .get('/api/rooms')
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

    it('should be Room get by id', function (done) {

        request(app)
            .post('/api/rooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/rooms/' + resp.data._id)
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
                        assert.equal(resp.data.build, mockup.build);
                        assert.equal(resp.data.floor, mockup.floor);
                        done();
                    });
            });

    });

    it('should be Room post use token', (done)=>{
        request(app)
            .post('/api/rooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.roomid, mockup.roomid);
                assert.equal(resp.data.year, mockup.year);
                assert.equal(resp.data.term, mockup.term);
                assert.equal(resp.data.build, mockup.build);
                assert.equal(resp.data.floor, mockup.floor);
                done();
            });
    });

    it('should be room put use token', function (done) {

        request(app)
            .post('/api/rooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    roomid: '23910',
                    year: '2564',
                    term: '1',
                    build: '23',
                    floor: '9',
                }
                request(app)
                    .put('/api/rooms/' + resp.data._id)
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
                        assert.equal(resp.data.build, update.build);
                        assert.equal(resp.data.floor, update.floor);
                        done();
                    });
            });

    });

    it('should be room delete use token', function (done) {

        request(app)
            .post('/api/rooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/rooms/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be room get not use token', (done)=>{
        request(app)
        .get('/api/rooms')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    xit('should be room post not use token', function (done) {

        request(app)
            .post('/api/rooms')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be room put not use token', function (done) {

        request(app)
            .post('/api/rooms')
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
                    .put('/api/rooms/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be room delete not use token', function (done) {

        request(app)
            .post('/api/rooms')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/rooms/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Room.deleteMany().exec(done);
    });

});