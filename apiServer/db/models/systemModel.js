'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appCfgSchema = new Schema({
    userCount: {
        type: Number,
        default: 0
    }
}, {
    collection: 'appCfg',
    id: false
});

module.exports = appCfgSchema;