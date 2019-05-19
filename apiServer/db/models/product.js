'use strict';

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productId: {
        type: String,
        unique: true
    },
    manufactTime: {
        type: String
    },
    charInfo1: {
        type: String
    },
    charInfo2: {
        type: String
    },
    charInfo3: {
        type: String
    },
    charInfo4: {
        type: String
    },
    charInfo5: {
        type: String
    },
    charInfo6: {
        type: String
    },
    charInfo7: {
        type: String
    },
    charInfo8: {
        type: String
    },
    charInfo9: {
        type: String
    },
    charInfo0: {
        type: String
    },
    imgInfo1: {
        type: String
    },
    imgInfo2: {
        type: String
    },
    imgInfo3: {
        type: String
    },
    imgInfo4: {
        type: String
    },
    imgInfo5: {
        type: String
    },
    imgInfo6: {
        type: String
    },
    imgInfo7: {
        type: String
    },
    imgInfo8: {
        type: String
    },
    imgInfo9: {
        type: String
    },
    imgInfo0: {
        type: String
    },
    status: {
        type: String,
        default: "valid"
    }
});

var productModel = global.db.model("product", productSchema,"product");
exports.model = productModel;