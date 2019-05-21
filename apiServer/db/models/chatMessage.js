'use strict';

const mongoose = require('mongoose');

const chatMessageSchema = mongoose.Schema({
    messageId: {
        type: Number,
        unique: true
    },
    user: {
        type: String
    },
    chatId: {
        type: String
    },
    messageType: {
        type: String
    },
    status: {
        type: String,
        default: 'normal'
    },
    createTime: {
        type: Date
    },
    content: {
        type: String
    }
});

var chatMessageModel = global.db.model("chatMessage", chatMessageSchema,"chatMessage");
exports.model = chatMessageModel;