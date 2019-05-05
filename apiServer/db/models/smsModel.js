'use strict';

const mongoose = require('mongoose');

const smsSchema = mongoose.Schema({
    mobilePhone: {
        type: String,
        unique: true
    },
    code: {
        type: String
    }
});

var smsModel = global.db.model("sms", smsSchema,"sms");
exports.model = smsModel;