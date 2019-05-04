'use strict';

const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    nickName: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    verificationCode: {
        type: String
    },
    sex: {
        type: String           //true: boy; false: girl;
    },
    age: {
        type: Number
    },
    photoPath: {
        type: String
    },
    mobilePhone: {
        type: String
    },
    latestLoginDate: {
        type: Date
    },
    latestLogoutDate: {
        type: Date
    },
    registTime: {
        type: Number
    },
    loginTime: {
        type: Number
    },
    logoutTime: {
        type: Number
    },
    partner: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: 'inactive'
    }
});

var userModel = global.db.model("user", usersSchema,"user");
exports.model = userModel;