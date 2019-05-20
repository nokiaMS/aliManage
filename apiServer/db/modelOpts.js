'use strict';
const mongoose = require('mongoose');

let LOG_PREFIX = "====>DB_Opts ";
let DB_PATH = 'mongodb://127.0.0.1:27017/apiServer';

let systemSchema;
let userInfo;
let userModel;
let smsModel;
let cardModel;
let productModel;
let publicationModel;

let db = mongoose.createConnection(DB_PATH, {
    useNewUrlParser: true
});

db.on('connected', (err) => {
    global.db = db
    console.log('api server db is connected.');
    systemSchema = require('./models/systemModel');
    userInfo = require('./models/usersModel');
    userModel = require('./models/userModel');
    smsModel = require('./models/smsModel');
    cardModel = require('./models/cardModel');
    productModel = require('./models/product');
    publicationModel = require('./models/chainModel');
});

/* Add publication information to db. */
exports.savePublicationSync = function (publicationInst) {
    return new Promise( function(resolve, reject) {
        publicationModel.model.create(publicationInst, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "savePublicationSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "savePublicationSync" + err);
                reject(err);
            }
        });
    });
};

/* Get publication information by uid. */
exports.getPublicationsByUidSync = async function (uid, page, count) {
    return new Promise( function(resolve, reject) {
        publicationModel.model.find({uid: uid}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getPublicationsByUserSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getPublicationsByUserSync" + err);
                reject(err);
            }
        });
    });
};

/* Get publication information by status. */
exports.getPublicationsByStatusSync = async function (status, page, count) {
    return new Promise( function(resolve, reject) {
        var skipCnt = page * count;
        var limitCnt = count;
        var filterJson = {skip: skipCnt, limit: limitCnt, sort:{'_id':-1}};
        publicationModel.model.find({status: status}, null, filterJson, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getPublicationsByStatusSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getPublicationsByStatusSync" + err);
                reject(err);
            }
        });
    });
};

/* Get product information by product id. */
exports.getPublicationsByUserSync = async function (userName, page, count) {
    return new Promise( function(resolve, reject) {
        var skipCnt = page * count;
        var limitCnt = count;
        var filterJson = {skip: skipCnt, limit: limitCnt, sort:{'_id':-1}};
        publicationModel.model.find({user: userName}, null, filterJson, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getPublicationsByUserSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getPublicationsByUserSync" + err);
                reject(err);
            }
        });
    });
};

/* Get product information by product id. */
exports.getProductInfoSync = async function (productId) {
    return new Promise( function(resolve, reject) {
        productModel.model.find({productId: productId}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getProductInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getProductInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Add product information to db. */
exports.saveProductSync = function (productInst) {
    return new Promise( function(resolve, reject) {
        productModel.model.create(productInst, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "saveProductSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "saveProductSync" + err);
                reject(err);
            }
        });
    });
};

/* Add card information to db. */
exports.saveCardSync = function (cardInst) {
    return new Promise( function(resolve, reject) {
        cardModel.model.create(cardInst, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "saveCardSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "saveCardSync" + err);
                reject(err);
            }
        });
    });
};

/* Delete card information to db. */
exports.deleteCardSync = function (cardId) {
    return new Promise( function(resolve, reject) {
        cardModel.model.remove({cardId:cardId}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "deleteCardSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "deleteCardSync" + err);
                reject(err);
            }
        });
    });
};

/* Update card information to db. */
exports.updateCardByIdSync = function (cardId, jsonStr) {
    return new Promise( function(resolve, reject) {
        cardModel.model.findOneAndUpdate({cardId: cardId},{$set: jsonStr}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "updateCardByIdSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "updateCardByIdSync" + err);
                reject(err);
            }
        });
    });
};

/* Get card list by user name. */
exports.getCardListByNameSync = async function (name) {
    return new Promise( function(resolve, reject) {
        cardModel.model.find({bindUser: name}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getCardListByNameSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getCardListByNameSync" + err);
                reject(err);
            }
        });
    });
};

/* Save user information to db. */
exports.saveUserSync = function (userInst) {
    return new Promise( function(resolve, reject) {
        userModel.model.create(userInst, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "saveUserSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "saveUserSync" + err);
                reject(err);
            }
        });
    });
};

/* Get user info by phone num. */
exports.getUserByPhoneSync = async function (phone) {
    return new Promise( function(resolve, reject) {
        userModel.model.find({mobilePhone: phone}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserByPhoneSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserByPhoneSync" + err);
                reject(err);
            }
        });
    });
};

/* Get user info by nick name. */
exports.getUserByNameSync = async function (name) {
    return new Promise( function(resolve, reject) {
        userModel.model.find({nickName: name}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserByPhoneSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserByPhoneSync" + err);
                reject(err);
            }
        });
    });
};

/* Update user information to db. */
exports.updateUserByNameSync = function (name, jsonStr) {
    return new Promise( function(resolve, reject) {
        userModel.model.findOneAndUpdate({nickName: name},{$set: jsonStr}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "updateUserByNameSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "updateUserByNameSync" + err);
                reject(err);
            }
        });
    });
};

/* Update SMS. */
exports.updateSMS = function (phone, verCode) {
    return new Promise( function(resolve, reject) {
        smsModel.model.findOneAndUpdate({mobilePhone: phone},{$set: {code: verCode}},{upsert: true}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "updateSMS" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "updateSMS" + err);
                reject(err);
            }
        });
    });
};

/* Get SMS code by phone. */
exports.getSMSByPhoneSync = async function (phone) {
    return new Promise( function(resolve, reject) {
        userModel.model.find({mobilePhone: phone}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getSMSByPhoneSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getSMSByPhoneSync" + err);
                reject(err);
            }
        });
    });
};

//=============================================================================================================

/* Get user info by id. */
exports.getUserInfoSync = async function (uid) {
    return new Promise( function(resolve, reject) {
        userInfo.model.find({userId: uid}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Get user info by phone num. */
exports.getUserInfoByPhoneSync = async function (phone) {
    return new Promise( function(resolve, reject) {
        userInfo.model.find({mobilePhone: phone}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Get user info by nick name. */
exports.getUserInfoByNameSync = async function (name) {
    return new Promise( function(resolve, reject) {
        userInfo.model.find({nickName: name}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "getUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "getUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Save user information to db. */
exports.saveUserInfoSync = function (userInst) {
    return new Promise( function(resolve, reject) {
        userInfo.model.create(userInst, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "saveUserInfoSync" + userInst);
                console.log(LOG_PREFIX + "saveUserInfoSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "saveUserInfoSync" + err);
                reject(err);
            }
        });
    });
};

/* Update user information to db. */
exports.updateUserInfoByNameSync = function (name, jsonStr) {
    return new Promise( function(resolve, reject) {
        userInfo.model.findOneAndUpdate({nickName: name},{$set: jsonStr},{new: true}, function (err, result) {
            if(!err) {
                console.log(LOG_PREFIX + "UpdateUserInfoByNameSync" + name);
                console.log(LOG_PREFIX + "UpdateUserInfoByNameSync" + result);
                resolve(result);
            } else {
                console.log(LOG_PREFIX + "UpdateUserInfoByNameSync" + err);
                reject(err);
            }
        });
    });
};

