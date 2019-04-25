'use strict'

exports.TYPEID_INVALID_MOBILE_PHONE = '0x2';
exports.DETAIL_INVALID_MOBILE_PHONE = "invalid mobile phone number";

exports.TYPEID_INVALID_PASSWORD = '0x3';
exports.DETAIL_INVALID_PASSWORD = "invalid password";

exports.TYPEID_INVALID_NICKNAME = '0x4';
exports.DETAIL_INVALID_NICKNAME = "invalid nick name";

exports.TYPEID_INVALID_SEX = '0x5';
exports.DETAIL_INVALID_SEX = "invalid sex field";

exports.TYPEID_INVALID_AGE = '0x6';
exports.DETAIL_INVALID_AGE = "invalid age field";

exports.TYPEID_PHONE_HAS_BEEN_REGISTED = '0x7';
exports.DETAIL_PHONE_HAS_BEEN_REGISTED = "phone number has been registed.";

exports.TYPEID_NICKNAME_HAS_BEEN_REGISTED = '0x8';
exports.DETAIL_NICKNAME_HAS_BEEN_REGISTED = "nick name has been registed.";

exports.TYPEID_USER_DOES_NOT_REGISTED = '0x9';
exports.DETAIL_USER_DOES_NOT_REGISTED = "user does not registed.";

exports.TYPEID_USER_ALREADY_LOGIN = '0xa';
exports.DETAIL_USER_ALREADY_LOGIN = "user has alreay logged in, should not log in again.";

exports.TYPEID_USER_WRONG_PASSWORD = '0xb';
exports.DETAIL_USER_WRONG_PASSWORD = "wrong password.";

exports.TYPEID_USER_DOES_NOT_LOGIN = '0xc';
exports.DETAIL_USER_DOES_NOT_LOGIN = "user does not login.";

exports.ret_registUser_noErr = function (msgId, userInfo, uid, tmpUserId, dur) {
    return {
        "msgId": msgId,
        "type": "ret_registUser_noErr",
        "typeId": "0x1",
        "uniqueId": uid,
        "tmpId": tmpUserId,
        "duration": dur,
        "info": userInfo
    };
};

exports.ret_registUser_invalidField = function (msgId, userInfo, errId, detail) {
    return {
        "msgId": msgId,
        "type": "ret_registUser_invalidField",
        "typeId": errId,
        "details": detail,
        "info": userInfo
    };
};

exports.ret_user_error = function (msgId, userInfo, errId, detail) {
    return {
        "msgId": msgId,
        "type": "ret_user_error",
        "typeId": errId,
        "details": detail,
        "info": userInfo
    };
};

exports.ret_user_login_noErr = function (msgId, userInfo, tmpUserId, duration) {
    return {
        "msgId": msgId,
        "type": "ret_user_login_noErr",
        "tmpId": tmpUserId,
        "duration": duration,
        "info": userInfo
    };
};

exports.ret_user_logout_noErr = function (msgId, userInfo) {
    return {
        "msgId": msgId,
        "type": "ret_user_logout_noErr",
        "info": userInfo
    };
};