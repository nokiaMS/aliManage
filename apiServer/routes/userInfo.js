'use strict';

let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let returnInfo = require('../errInfo/returnInfo');
let stringRandom = require('string-random');

let express = require('express');
let router = express.Router();

//check userInfo validation and return the failed reason.
async function parseUserInfo(msgId, userInfo , userId, tmpUserId) {
    return new Promise(async function (resolve, reject) {
        let parsedUserInfo = userInfo;
        parsedUserInfo.userId = userId;
        parsedUserInfo.tmpId = tmpUserId;
        parsedUserInfo.duration = 60*60*24*365;  //one year.
        let failedReason = "";
        let errId = "";
        let result;
        let ret = {
            msgId: msgId,
            parsedUserInfo: parsedUserInfo
        };

        if((userInfo.mobilePhone === "") || (userInfo.mobilePhone === undefined)) {
            ret = {
                msgId: msgId,
                errorId: returnInfo.TYPEID_INVALID_MOBILE_PHONE,
                failedReason: returnInfo.DETAIL_INVALID_MOBILE_PHONE,
                parsedUserInfo: parsedUserInfo
            }
            reject(ret);
        } else {
            //check phone number duplication.
            result = await modelOpts.getUserInfoByPhoneSync(userInfo.mobilePhone);
            if (result.length !== 0) {
                ret = {
                    msgId: msgId,
                    errorId: returnInfo.TYPEID_PHONE_HAS_BEEN_REGISTED,
                    failedReason: returnInfo.DETAIL_PHONE_HAS_BEEN_REGISTED,
                    parsedUserInfo: parsedUserInfo
                }
                reject(ret);
            } else {
                //check nick name duplication.
                result = await modelOpts.getUserInfoByNameSync(userInfo.nickName);
                if (result.length !== 0) {
                    ret = {
                        msgId: msgId,
                        errorId: returnInfo.TYPEID_NICKNAME_HAS_BEEN_REGISTED,
                        failedReason: returnInfo.DETAIL_NICKNAME_HAS_BEEN_REGISTED,
                        parsedUserInfo: parsedUserInfo
                    }
                    reject(ret);
                } else {
                    console.log("func:parseUserInfo return:", ret);
                    resolve(ret);
                }
            }
        }
    })
}

/*
    Function: Regist user by POST method.
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/userInfo/regist' --data '{
            "msgInfo": {
                 "msgId" : "0x222",
                 "userInfo" : {
                      "nickName": "Jerrab",
                      "password": "123456",
                      "sex": "true",
                      "age": "35",
                      "mobilePhone": "13499884758"
                 }
            }
}'

     http response:
        1.  success:
{
  "msgId": "0x222",
  "type": "ret_registUser_noErr",
  "typeId": "0x1",
  "tmpId": "mpDyUCyFvaphvNcg",
  "duration": 31536000,
  "info": {
    "nickName": "Jerracb",
    "password": "123456",
    "sex": "true",
    "age": "35",
    "mobilePhone": "13499884751",
    "userId": "4GmORDFn",
    "tmpId": "mpDyUCyFvaphvNcg",
    "duration": 31536000
  }
}

        2. error happened:
{
  "msgId": "0x222",
  "type": "ret_registUser_invalidField",
  "typeId": "0x7",
  "details": "phone number has been registed.",
  "info": {
    "nickName": "Jerrab",
    "password": "123456",
    "sex": "true",
    "age": "35",
    "mobilePhone": "13499884758",
    "userId": "Sx83gNLY",
    "tmpId": "wEYEviRHCYxWcfxY",
    "duration": 31536000
  }
}

        3. 錯誤信息列表:
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
}
*/
router.post('/regist',  async function (req, res) {
    try {
        let userId;
        let userInfo = req.body.msgInfo.userInfo;
        let msgId = req.body.msgInfo.msgId;

        while (true) {
            userId = utils.generateUserId();
            console.log("Generate new user id:", userId);

            //Check whether userId exists in db.
            let result = await modelOpts.getUserInfoSync(userId);
            if (result.length === 0) {
                break;
            }
        }

        //generate tmpUserId.
        let tmpUserId = stringRandom(16, {numbers: false});  // AgfPTKheCgMvwNqX
        let checkedUserInfo = await parseUserInfo(msgId, userInfo, userId, tmpUserId);
        let cliRet;
        if (checkedUserInfo.failedReason === undefined) {
            //Have got a unique id, then send back to client.
            await modelOpts.saveUserInfoSync(checkedUserInfo.parsedUserInfo);

            console.log(req.body);
            cliRet = returnInfo.ret_registUser_noErr(msgId, userInfo, userInfo.uniqueId, checkedUserInfo.parsedUserInfo.tmpId, checkedUserInfo.parsedUserInfo.duration);
        }
        res.send(cliRet);
    } catch(e) {
        console.log("Error happened,", e.parsedUserInfo);
        let cliRet = returnInfo.ret_registUser_invalidField(req.body.msgInfo.msgId, req.body.msgInfo.userInfo, e.errorId, e.failedReason);
        res.send(cliRet);
    }
});

/* POST user information. */
/*
* function:
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/userInfo/login' --data '{
            "msgInfo": {
                 "msgId" : "0x222",
                 "userInfo" : {
                      "nickName": "Jerracb",
                      "password": "123456"
                 }
            }
}'
* result:
1. success:
{
  "msgId": "0x222",
  "type": "ret_user_login_noErr",
  "tmpId": "mpDyUCyFvaphvNcg",
  "duration": 31536000,
  "info": {
    "nickName": "Jerracb",
    "password": "123456"
  }
}

2. ERROR:
{
  "msgId": "0x222",
  "type": "ret_user_error",
  "typeId": "0xa",
  "details": "user has alreay logged in, should not log in again.",
  "info": {
    "nickName": "Jerracb",
    "password": "123456"
  }
}
* */
router.post('/login', async function (req, res) {
    //1. Check whether user has registered.
    try {
        let userInfo = req.body.msgInfo.userInfo;
        let name = userInfo.nickName;
        let msgId = req.body.msgInfo.msgId;
        let result = await modelOpts.getUserInfoByNameSync(name);
        if(result.length === 0) {
            let cliRet = returnInfo.ret_user_error(msgId, req.body.msgInfo.userInfo, returnInfo.TYPEID_USER_DOES_NOT_REGISTED, returnInfo.DETAIL_USER_DOES_NOT_REGISTED);
            res.send(cliRet);
        } else {
            if(utils.checkPassword(result[0].password, userInfo.password)) {
                if(result[0].status === 'active') {
                    let cliRet = returnInfo.ret_user_error(msgId, req.body.msgInfo.userInfo, returnInfo.TYPEID_USER_ALREADY_LOGIN, returnInfo.DETAIL_USER_ALREADY_LOGIN);
                    res.send(cliRet);
                } else {
                    let cliRet = returnInfo.ret_user_login_noErr(msgId, userInfo, result[0].tmpId, result[0].duration);
                    //update status to database.
                    let dbRet = await modelOpts.updateUserInfoByNameSync(name,{status: 'active'});
                    console.log(dbRet);
                    res.send(cliRet);
                }
            } else {
                let cliRet = returnInfo.ret_user_error(msgId, userInfo, returnInfo.TYPEID_USER_WRONG_PASSWORD, returnInfo.DETAIL_USER_WRONG_PASSWORD);
                res.send(cliRet);
            }
        }
    } catch (e) {
        console.log(e);
    }
});

/* POST user information. */
/*
* function:
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/userInfo/logout' --data '{
            "msgInfo": {
                 "msgId" : "0x222",
                 "userInfo" : {
                      "nickName": "Jerracb",
                      "password": "123456"
                 }
            }
}'
*
* 2. result:
success:
{
  "msgId": "0x222",
  "type": "ret_user_logout_noErr",
  "info": {
    "nickName": "Jerracb",
    "password": "123456"
  }
}

fail:
{
  "msgId": "0x222",
  "type": "ret_user_error",
  "typeId": "0xc",
  "details": "user does not login.",
  "info": {
    "nickName": "Jerracb",
    "password": "123456"
  }
}
* */
router.post('/logout', async function (req, res) {
    //1. Check whether user has registered.
    try {
        let userInfo = req.body.msgInfo.userInfo;
        let name = userInfo.nickName;
        let msgId = req.body.msgInfo.msgId;
        let result = await modelOpts.getUserInfoByNameSync(name);
        if(result.length === 0) {
            let cliRet = returnInfo.ret_user_error(msgId, req.body.msgInfo.userInfo, returnInfo.TYPEID_USER_DOES_NOT_REGISTED, returnInfo.DETAIL_USER_DOES_NOT_REGISTED);
            res.send(cliRet);
        } else if(result[0].status !== 'active') {
            let cliRet = returnInfo.ret_user_error(msgId, req.body.msgInfo.userInfo, returnInfo.TYPEID_USER_DOES_NOT_LOGIN, returnInfo.DETAIL_USER_DOES_NOT_LOGIN);
            res.send(cliRet);
        } else {
            if(utils.checkPassword(result[0].password, userInfo.password)) {
              let cliRet = returnInfo.ret_user_logout_noErr(msgId, userInfo);
              //update status to database.
              let dbRet = await modelOpts.updateUserInfoByNameSync(name,{status: 'inactive'});
              console.log(dbRet);
              res.send(cliRet);
            } else {
                let cliRet = returnInfo.ret_user_error(msgId, userInfo, returnInfo.TYPEID_USER_WRONG_PASSWORD, returnInfo.DETAIL_USER_WRONG_PASSWORD);
                res.send(cliRet);
            }
        }
    } catch (e) {
        console.log(e);
    }
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
