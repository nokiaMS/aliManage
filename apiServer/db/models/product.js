'use strict';

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productId: {
        type: String,
        unique: true
    },
    charInfos: {
        type: [{
            status: String,
            publisher: String,
            date: {type: Date, default: Date.now},
            content: String
        }]
    },
    imgInfos: {
        type: [{
            status: String,
            publisher: String,
            date: {type: Date, default: Date.now},
            content: String
        }]
    },
    status: {
        type: String,
        default: "waitingOnChain"
    }
});

var productModel = global.db.model("product", productSchema,"product");
exports.model = productModel;