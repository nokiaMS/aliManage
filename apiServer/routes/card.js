'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/card/add' --data '{
"uid":"0x3344",
"cardID":"33827238339",
"user": "Jerraba"
}'
* */
router.post('/add', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let cardId = req.body.cardID;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(user);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            let cardInfo = {cardId:cardId, bindUser: user}
            await modelOpts.saveCardSync(cardInfo);
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"
            }
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/card/delete' --data '{
"uid":"0x3344",
"cardID":"33827238339"
}'
* */
router.post('/delete', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let cardId = req.body.cardID;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.
        //3. 检查用户是否已经登录,只有登录用户才能登出.
        await modelOpts.deleteCardSync(cardId);
        ret = {
            uid: uid,
            status: "true",
            errCode: "0x10000"
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/card/bind' --data '{
"uid":"0x3344",
"user": "Jerraba",
"cardID":"33827238339"
}'
* */
router.post('/bind', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let cardId = req.body.cardID;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(user);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            await modelOpts.updateCardByIdSync(cardId,{status:"bound"});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"
            }
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/card/unbind' --data '{
"uid":"0x3344",
"user": "Jerraba",
"cardID":"33827238339"
}'
* */
router.post('/unbind', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let cardId = req.body.cardID;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(user);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            await modelOpts.updateCardByIdSync(cardId,{status:"unbound"});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"
            }
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/card/list' --data '{
"uid":"0x3344",
"user": "Jerraba"
}'

返回结果:
{
  "uid": "0x3344",
  "status": true,
  "cards": [{
    "status": "unbound",
    "_id": "5ce03a282a0f5d1c4f807240",
    "cardId": "33827238339",
    "bindUser": "Jerraba",
    "__v": 0
  }, {
    "status": "valid",
    "_id": "5ce03d3bfc9e9d1d64f170f8",
    "cardId": "1111",
    "bindUser": "Jerraba",
    "__v": 0
  }, {
    "status": "valid",
    "_id": "5ce03d41fc9e9d1d64f170f9",
    "cardId": "2222",
    "bindUser": "Jerraba",
    "__v": 0
  }, {
    "status": "valid",
    "_id": "5ce03d45fc9e9d1d64f170fa",
    "cardId": "3333",
    "bindUser": "Jerraba",
    "__v": 0
  }]
}
* */
router.post('/list', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(user);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            let result = await modelOpts.getCardListByNameSync(user);
            ret = {
                uid: uid,
                status: true,
                cards: result
            }
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

module.exports = router;
