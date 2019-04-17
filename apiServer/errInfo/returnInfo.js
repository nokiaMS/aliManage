'use strict'

exports.INVALID_MOBILE_PHONE = "invalid mobile phone number";

exports.ret_registUser_noErr = function (uid, tmpUserId, dur) {
    return {
        "type": "ret_registUser_noErr",
        "uniqueId": uid,
        "tmpId": tmpUserId,
        "duration": dur
    };
};

exports.ret_registUser_invalidField = function (userInfo, detail) {
    return {
        "type": "ret_registUser_invalidField",
        "details": detail,
        "info": userInfo
    };
};