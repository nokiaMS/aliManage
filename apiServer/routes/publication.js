'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chain/result' --data '{
"uid": "0x3344",
"user": "Jerraba",
"page": "0",
"count": "2"
}'

返回结果:
{
  "uid": "0x3344",
  "status": "true",
  "publications": [{
    "infoType": "char",
    "_id": "5ce26a12cc9ad94469553a45",
    "user": "Jerraba",
    "info": "这是一个美好的夜晚.2地方大幅度222",
    "status": "waitingOnChain",
    "createTime": "2019-05-20T08:49:22.146Z",
    "onchainTime": "2019-05-20T08:49:22.146Z",
    "__v": 0
  }, {
    "infoType": "char",
    "_id": "5ce26a0ccc9ad94469553a44",
    "user": "Jerraba",
    "info": "这是一个美好的夜晚.2222",
    "status": "waitingOnChain",
    "createTime": "2019-05-20T08:49:16.575Z",
    "onchainTime": "2019-05-20T08:49:16.575Z",
    "__v": 0
  }]
}
* */
router.post('/result', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let page = req.body.page;
    let count = req.body.count;
    let ret;

    try {
        let result = await modelOpts.getPublicationsByUserSync(user, parseInt(page), parseInt(count));
        ret = {
            uid: uid,
            status: "true",
            publications: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/**
 * 发布publication信息.
 */
router.post('/single', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let infoType = req.body.infoType;
    let info = req.body.info;
    let ret;

    let publication = {
        uid: uid,
        user: user,
        infoType: infoType,
        info: info,
        status: "waitingOnChain",
        createTime: Date.now(),
        onchainTime: Date.now()
    }

    try {
        //2. 检查参数有效性,参数无效抛出异常.
        await modelOpts.savePublicationSync(publication);
        ret = {
            uid: uid,
            status: true,
            errCode: 0x10000
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/**
 * 获得publication信息状态.
 */
router.post('/single/status', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let ret;

    try {
        let result = await modelOpts.getPublicationsByUidSync(uid);
        ret = {
            uid: uid,
            status: "true",
            publications: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chain/squre' --data '{
"uid": "0x5",
"page": "0",
"count": "2"
}'
返回结果:
{
  "uid": "0x5",
  "status": "true",
  "publications": [{
    "infoType": "char",
    "_id": "5ce274c94f085049b3467e0c",
    "uid": "0x5",
    "user": "aaa",
    "info": "太阳当空照",
    "status": "waitingOnChain",
    "createTime": "2019-05-20T09:35:05.895Z",
    "onchainTime": "2019-05-20T09:35:05.895Z",
    "__v": 0
  }, {
    "infoType": "char",
    "_id": "5ce27477b762c2497687ad63",
    "user": "aaa",
    "info": "太阳当空照",
    "status": "waitingOnChain",
    "createTime": "2019-05-20T09:33:43.183Z",
    "onchainTime": "2019-05-20T09:33:43.183Z",
    "__v": 0
  }]
}
* */
router.post('/squre', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let page = req.body.page;
    let count = req.body.count;
    let ret;

    try {
        let result = await modelOpts.getPublicationsByStatusSync("onChain",parseInt(page), parseInt(count));
        ret = {
            uid: uid,
            status: "true",
            publications: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

router.post('/waiting', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let page = req.body.page;
    let count = req.body.count;
    let ret;

    try {
        let result = await modelOpts.getPublicationsByStatusSync("waitingOnChain",parseInt(page), parseInt(count));
        ret = {
            uid: uid,
            status: "true",
            publications: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/**
 * 更新产品信息.
 */
router.post('/onchain', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.
        let result = await modelOpts.updatePublicationByIdSync(uid,{status: 'onChain'});
        ret = {
            uid: uid,
            status: true,
            publicationInfo: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

module.exports = router;
