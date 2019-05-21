'use strict';

const mongoose = require('mongoose');

const chatRelationSchema = mongoose.Schema({
    chatId: {
        type: String
    },
    userName: {
        type: String
    },
    latestMessageIndex: {
        type: Number
    }
});

var chatRelationModel = global.db.model("chatRelation", chatRelationSchema,"chatRelation");
exports.model = chatRelationModel;