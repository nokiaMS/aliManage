'use strict';

const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    cardId: {
        type: String,
        unique: true
    },
    bindUser: {
        type: String
    },
    status: {
        type: String,
        default: "valid"
    }
});

var cardModel = global.db.model("card", cardSchema,"card");
exports.model = cardModel;