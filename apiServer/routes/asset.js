'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

router.post('/increase', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let name = req.body.user;
    let asset = req.body.asset;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(name);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            let assetStr;
            if(parseInt(asset.assetId) === 0x1) {
                let count = parseInt(asset.value) + userInDB[0].asset1;
                assetStr = {asset1: count};
            } else if(parseInt(asset.assetId) === 0x2) {
                let count = parseInt(asset.value) + userInDB[0].asset2;
                assetStr = {asset2: count};
            } else if(parseInt(asset.assetId) === 0x3) {
                let count = parseInt(asset.value) + userInDB[0].asset3;
                assetStr = {asset3: count};
            } else if(parseInt(asset.assetId) === 0x4) {
                let count = parseInt(asset.value) + userInDB[0].asset4;
                assetStr = {asset4: count};
            } else if(parseInt(asset.assetId) === 0x5) {
                let count = parseInt(asset.value) + userInDB[0].asset5;
                assetStr = {asset5: count};
            }
            await modelOpts.updateUserByNameSync(name, assetStr);
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
guoxu@ubuntu:~/gx/aliManage$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/asset/decrease' --data '{"uid":"0x2222","user":"Jerrabagx","asset":{"assetId":"0x1","value":"50"}}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-JcB0lKw85ZyXpRLLTF/rWEfSFZ4"
Date: Sun, 12 May 2019 07:42:08 GMT
Connection: keep-alive

guoxu@ubuntu:~/gx/aliManage$
* */
router.post('/decrease', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let name = req.body.user;
    let asset = req.body.asset;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(name);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            let assetStr;
            if((parseInt(asset.assetId) === 0x1) && (userInDB[0].asset1 >= parseInt(asset.value))) {
                let count = userInDB[0].asset1 - parseInt(asset.value);
                assetStr = {asset1: count};
            } else if((parseInt(asset.assetId) === 0x2) && (userInDB[0].asset2 >= parseInt(asset.value))) {
                let count = userInDB[0].asset2 - parseInt(asset.value);
                assetStr = {asset2: count};
            } else if((parseInt(asset.assetId) === 0x3) && (userInDB[0].asset3 >= parseInt(asset.value))) {
                let count = userInDB[0].asset3 - asset.value;
                assetStr = {asset3: count};
            } else if((parseInt(asset.assetId) === 0x4) && (userInDB[0].asset4 >= parseInt(asset.value))) {
                let count = userInDB[0].asset4 - asset.value;
                assetStr = {asset4: count};
            } else if((parseInt(asset.assetId) === 0x5) && (userInDB[0].asset5 >= parseInt(asset.value))) {
                let count = userInDB[0].asset5 - asset.value;
                assetStr = {asset5: count};
            } else {
                ret = {
                    uid: uid,
                    status: "false",
                    errCode: "0x20016"
                }
            }
            await modelOpts.updateUserByNameSync(name, assetStr);
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
guoxu@ubuntu:~/gx/aliManage$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/asset/list' --data '{"uid":"0x2222","user":"Jerrabagx"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 131
ETag: W/"83-tADRvGBPn6Um4H0N85EmTywEeBY"
Date: Sun, 12 May 2019 08:17:28 GMT
Connection: keep-alive

{"uid":"0x2222","user":"Jerrabagx","assets":[{"assetId":"0x1","value":50},{"assetId":"0x2","value":0},{"assetId":"0x3","value":0}]}
guoxu@ubuntu:~/gx/aliManage$
* */
router.post('/list', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let name = req.body.user;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(name);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else {
            let assets = []
            assets.push({assetId:"0x1", value: userInDB[0].asset1})
            assets.push({assetId:"0x2", value: userInDB[0].asset2})
            assets.push({assetId:"0x3", value: userInDB[0].asset3})

            ret = {
                uid: uid,
                user: name,
                assets: assets
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
