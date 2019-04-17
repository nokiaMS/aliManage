'use strict';

const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
        userId: {
            type: String,
            required: true,
            unique: true
        },
        tmpId: {
            type: String,
            unique: true,
            default: "0x"
        },
        duration: {
            type: Number,
            default: 31536000       //one year.
        },
        nickName: {
            type: String
        },
        sex: {
            type: Boolean           //true: boy; false: girl;
        },
        age: {
            type: Number
        },
        photoPath: {
            type: String,
            default: ""
        },
        mobilePhone: {
            type: String
        },
        cardInfo: {
            type: Array
        },
        bindCard: {
            type: String
        },
        keystorePath: {
            type: String
        },
        keystorePassword: {
            type: String
        },
        productList: {
            type: Array
        },
        publishInfo: {
            type: Array
        },
        latestLoginDate: {
            type: Date
        },
        latestLogoutDate: {
            type: Date
        },
        status: {
            type: String,
            default: 'active'
        }
    }
);

var userInfo = global.db.model("userInfo", usersSchema,"userInfo");
exports.model = userInfo;