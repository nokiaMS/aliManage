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
    asset1: {
        type: Number,
        default: 0
    },
    asset2: {
        type: Number,
        default: 0
    },
    asset3: {
        type: Number,
        default: 0
    },
    asset4: {
        type: Number,
        default: 0
    },
    asset5: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'inactive'
    }
});

var userModel = global.db.model("user", usersSchema,"user");
exports.model = userModel;