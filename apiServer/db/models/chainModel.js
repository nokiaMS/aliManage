'use strict';

const mongoose = require('mongoose');

const chainSchema = mongoose.Schema({
    user: {
        type: String
    },
    tranHash: {
        type: String,
        default: ''
    },
    uid: {
        type: String,
        unique: true
    },
    infoType: {
        type: String,
        default: "char"
    },
    info: {
        type: String,
    },
    status: {
        type: String
    },
    createTime: {
        type: Date
    },
    onchainTime: {
        type: Date
    }
});

var chainModel = global.db.model("chain", chainSchema,"chain");
exports.model = chainModel;