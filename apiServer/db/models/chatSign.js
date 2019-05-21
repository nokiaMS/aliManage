'use strict';

const mongoose = require('mongoose');

const chatSignSchema = mongoose.Schema({
    user: {
        type: String
    },
    chatId: {
        type: String
    },
    status: {
        type: String,
        default: 'normal'
    },
    signerList: {
        type: Array,
        default: []
    },
    from: {
        type: Number,
        default: 0
    },
    to: {
        type: Number,
        default: 0
    },
    signedList: {
        type: Array,
        default: []
    }
});

var chatSignModel = global.db.model("chatSign", chatSignSchema,"chatSign");
exports.model = chatSignModel;