'use strict';

let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let returnInfo = require('../errInfo/returnInfo');
let stringRandom = require('string-random');

let express = require('express');
let router = express.Router();

//check userInfo validation and return the failed reason.
function parseUserInfo( userInfo , userId, tmpUserId) {
    let parsedUserInfo = userInfo;
    parsedUserInfo.userId = userId;
    parsedUserInfo.tmpId = tmpUserId;
    parsedUserInfo.duration = 31536000;  //one year.
    let failedReason = "";
    if((userInfo.mobilePhone === "") || (userInfo.mobilePhone === undefined)) {
        failedReason = returnInfo.INVALID_MOBILE_PHONE;
        console.log("parseUserInfo error:", failedReason);
    }
    return {
        failedReason: failedReason,
        parsedUserInfo: parsedUserInfo
    };
}

/*
    Function: Regist user by POST method.
    curl:
        curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/userInfo/regist' --data '{
            "userInfo" : {
            "uniqueId": "0x1",
            "nickName": "Jerry",
            "password": "123456",
            "sex": "true",
            "age": "35",
            "mobilePhone": "13499884746"
            }
        }'

     http response:
        1.  success:
        {
            "type": "ret_registUser_noErr",
            "uniqueId": "0x1",
            "tmpId": "BHQufkyWfNLPStBn",
            "duration": 31536000
        }

        2. error happened:
        {
            "type": "ret_registUser_invalidField",
            "details": "invalid mobile phone number",
            "info": {
                "uniqueId": "0x1",
                "nickName": "Jerry",
                "password": "123456",
                "sex": "true",
                "age": "35",
                "userId": "YY7fqPkq",
                "tmpId": "pGfsNVHDSgULazbh",
                "duration": 31536000
            }
        }
*/
router.post('/regist',  async function (req, res) {
    let userId;
    let userInfo = req.body.userInfo;

    while (true) {
        userId = utils.generateUserId();
        console.log("Generate new user id:", userId);

        //Check whether userId exists in db.
        let result = await modelOpts.getUserInfoSync(userId);
        if(result.length === 0) {
            break;
        }
    }

    //generate tmpUserId.
    let tmpUserId = stringRandom(16, {numbers: false});  // AgfPTKheCgMvwNqX
    let checkedUserInfo = parseUserInfo(userInfo, userId, tmpUserId);
    let cliRet;
    if(checkedUserInfo.failedReason === '') {
        //Have got a unique id, then send back to client.
        modelOpts.saveUserInfoSync(checkedUserInfo.parsedUserInfo);

        console.log(req.body);
        cliRet = returnInfo.ret_registUser_noErr(userInfo.uniqueId, checkedUserInfo.parsedUserInfo.tmpId, checkedUserInfo.parsedUserInfo.duration);
    } else {
        cliRet = returnInfo.ret_registUser_invalidField(userInfo, checkedUserInfo.failedReason);
    }
    res.send(cliRet);
});

/* POST user information. */
router.post('/login', function (req, res) {
    console.log(req.body);
    res.send('Get a POST request.');
});

/* POST user information. */
router.post('/logout', function (req, res) {
    console.log(req.body);
    res.send('Get a POST request.');
});

/* modify user information. */
router.put('/', function (req, res) {
    console.log(req.body);
    res.send('Get a POST request.');
});

/* get user information. */
router.get('/', function (req, res) {
    console.log(req.body);
    res.send('Get a POST request.');
});

/* delete user information. */
router.delete('/', function (req, res) {
    console.log(req.body);
    res.send('Get a POST request.');
});

module.exports = router;
