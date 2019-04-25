'use strict';
const mongoose = require('mongoose');

let LOG_PREFIX = "====>DB_Opts ";
let DB_PATH = 'mongodb://127.0.0.1:27017/apiServer';

let systemSchema;
let userInfo;

let db = mongoose.createConnection(DB_PATH, {
    useNewUrlParser: true
});

db.on('connected', (err) => {
    global.db = db
    console.log('api server db is connected.');
    systemSchema = require('./models/systemModel');
    userInfo = require('./models/usersModel');
});

/* Get user info by id. */
exports.getUserInfoSync = async function (uid) {
    return new Promise( function(resolve, reject) {
        userInfo.model.find({userId: uid}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Get user info by phone num. */
exports.getUserInfoByPhoneSync = async function (phone) {
    return new Promise( function(resolve, reject) {
        userInfo.model.find({mobilePhone: phone}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Get user info by nick name. */
exports.getUserInfoByNameSync = async function (name) {
    return new Promise( function(resolve, reject) {
        userInfo.model.find({nickName: name}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Save user information to db. */
exports.saveUserInfoSync = function (userInst) {
    return new Promise( function(resolve, reject) {
        userInfo.model.create(userInst, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "saveUserInfoSync" + userInst);
                console.log(LOG_PREFIX + "saveUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "saveUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Update user information to db. */
exports.updateUserInfoByNameSync = function (name, jsonStr) {
    return new Promise( function(resolve, reject) {
        userInfo.model.findOneAndUpdate({nickName: name},{$set: jsonStr},{new: true}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "UpdateUserInfoByNameSync" + name);
                console.log(LOG_PREFIX + "UpdateUserInfoByNameSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "UpdateUserInfoByNameSync" + err);
                reject(err);
            }
        });
    });
};

