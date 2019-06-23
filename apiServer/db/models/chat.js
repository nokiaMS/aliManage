'use strict';

const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    chatId: {
        type: String,
        unique: true
    },
    chatName: {
        type: String
    },
    creator: {
        type: String
    },
    userList: {
        type: Array,
        default: []
    },
    chatType: {
        type: String,
        default: "public"
    },
    createTime: {
        type: Date
    },
    maxCount: {
        type: Number,
        default:5
    },
    latestMessageIndex: {
        type: Number,
        unique: true,
        default: 0
    },
    status: {
        type: String,
        default: 'active'
    }
});

var chatModel = global.db.model("chat", chatSchema,"chat");
exports.model = chatModel;