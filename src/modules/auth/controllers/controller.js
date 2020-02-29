'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Auth = mongoose.model('Auth'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    jwt = require("jsonwebtoken"),
    _ = require('lodash'),
    config = require("../../../config/config");

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
    Auth.find({}, {}, query, function (err, datas) {
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
    var newAuth = new Auth(req.body);
    newAuth.createby = req.user;
    newAuth.save(function (err, data) {
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

    Auth.findById(id, function (err, data) {
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
    var updAuth = _.extend(req.data, req.body);
    updAuth.updated = new Date();
    updAuth.updateby = req.user;
    updAuth.save(function (err, data) {
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

exports.signup = function (req, res) {
    Auth.findOne({ username: req.body.username }, function (err, user) {
        if (err || user) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (!user) {
                var user = new Auth(req.body);
                user.save(function (err, resUser) {
                    if (err) {
                        return res.status(400).send({
                            status: 400,
                            message: errorHandler.getErrorMessage(err)
                        });
                    } else {
                        resUser
                        res.jsonp({
                            status: 200,
                            data: resUser
                        });
                    }
                });
            }
        }
    })
};

exports.signin = function (req, res, next) {
    Auth.findOne({ username: req.body.username, password: req.body.password}, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (data) {
                req.user = data;
                next();
            }
        }
    })
};

exports.token = function (req, res) {
    var user = req.user;
    user.password = undefined;
    user.loginToken = "";
    user.loginToken = jwt.sign(_.omit(user, "password"), config.jwt.secret, {
        expiresIn: 2 * 60 * 60 * 1000
    });
    user.loginExpires = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    // return res.jsonp(user);
    res.jsonp({
        status: 200,
        token: user.loginToken
    });
};