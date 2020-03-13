'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Otheruser = mongoose.model('Otheruser');

var credentials,
    token,
    mockup,
    mockupCheck;

describe('Otheruser CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            identificationcode: '459415241015',
            firstname: 'ประยุทธ',
            lastname: 'จันทร์โอชา'
        };

        mockupCheck = {
            identificationcode: '459415241015',
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

    it('should be Otheruser get use token', (done) => {
        request(app)
            .get('/api/otherusers')
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

    it('should be Otheruser get by id', function (done) {

        request(app)
            .post('/api/otherusers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/otherusers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.identificationcode, mockup.identificationcode);
                        assert.equal(resp.data.firstname, mockup.firstname);
                        assert.equal(resp.data.lastname, mockup.lastname);
                        done();
                    });
            });

    });

    it('should be Otheruser post use token', (done) => {
        request(app)
            .post('/api/otherusers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.identificationcode, mockup.identificationcode);
                assert.equal(resp.data.firstname, mockup.firstname);
                assert.equal(resp.data.lastname, mockup.lastname);
                done();
            });
    });

    it('should be otheruser put use token', function (done) {

        request(app)
            .post('/api/otherusers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    identificationcode: '459415311544',
                    firstname: 'ประวิตร',
                    lastname: 'วงสุวรรณ',
                }
                request(app)
                    .put('/api/otherusers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.identificationcode, update.identificationcode);
                        assert.equal(resp.data.firstname, update.firstname);
                        assert.equal(resp.data.lastname, update.lastname);
                        done();
                    });
            });

    });

    xit('should be otheruser delete use token', function (done) {

        request(app)
            .post('/api/otherusers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/otherusers/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be otheruser get not use token', (done) => {
        request(app)
            .get('/api/otherusers')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be otheruser post not use token', function (done) {

        request(app)
            .post('/api/otherusers')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be otheruser put not use token', function (done) {

        request(app)
            .post('/api/otherusers')
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
                    .put('/api/otherusers/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be otheruser delete not use token', function (done) {

        request(app)
            .post('/api/otherusers')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/otherusers/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be Otheruser post use token', (done) => {
        var mockupOther = new Otheruser({
            identificationcode: '459415241015',
            firstname: 'ประยุทธ',
            lastname: 'จันทร์โอชา'
        });
        mockupOther.save();

        request(app)
            .post('/api/otherusers/checked')
            .set('Authorization', 'Bearer ' + token)
            .send(mockupCheck)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.identificationcode, mockup.identificationcode);
                assert.equal(resp.data.firstname, mockup.firstname);
                assert.equal(resp.data.lastname, mockup.lastname);
                done();
            });
    });

    afterEach(function (done) {
        Otheruser.deleteMany().exec(done);
    });

});