'use strict';
let stringRamdom = require('string-random');
let Core = require('@alicloud/pop-core');

exports.generateUserId = function () {
    let randomNum;

    try {
        randomNum = stringRamdom(8);
    } catch (e) {
        console.log(e);
    }
    return randomNum;
};

exports.checkPassword = function (src, dst) {
    if(src === dst) {
        return true;
    } else {
        return false;
    }
};

/*
* 发送短信验证码.
* */
exports.sendVerificationCode = function (code,phone) {
    var client = new Core({
        accessKeyId: 'LTAIPVNfpIVKXHpo',
        accessKeySecret: 'sg8EeNeCNcrPkHALPUJKhOXLtf4W8S',
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    });


    var params = {
        "PhoneNumbers": phone,
        "SignName": "密宝",
        "TemplateCode": "SMS_164508416",
        "TemplateParam": '{\"code\":' + code + "}"
    }

    var requestOption = {
        method: 'POST'
    };

    client.request('SendSms', params, requestOption).then((result) => {
        console.log(result);
    }, (ex) => {
        console.log(ex);
    })

}