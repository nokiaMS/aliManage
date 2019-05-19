'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/*
只用于测试.
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/product/add' --data '{
"uid": "0x3344",
"productId": "392827374833",
"manufactTime": "2019年8月25日",
"charInfo1": "aaaaaaaaaaaaa嘟嘟的度滴滴答",
"charInfo2": "bbbbbbbbbbbbb嘟嘟的度滴滴答",
"charInfo3": "ccccccccccccc嘟嘟的度滴滴答",
"imgInfo1": "393827283939.jpg",
"imgInfo2": "393937394993.jpeg"
}'
* */
router.post('/add', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let productId = req.body.productId;
    let manufactTime = req.body.manufactTime;
    let charInfo1 = req.body.charInfo1;
    let charInfo2 = req.body.charInfo2;
    let charInfo3 = req.body.charInfo3;
    let imgInfo1 = req.body.imgInfo1;
    let imgInfo2 = req.body.imgInfo2;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let productInfo = {
            productId:productId,
            manufactTime:manufactTime,
            charInfo1: charInfo1,
            charInfo2: charInfo2,
            charInfo3: charInfo3,
            imgInfo1: imgInfo1,
            imgInfo2: imgInfo2
        }
        await modelOpts.saveProductSync(productInfo);
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
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/product/info' --data '{
"uid": "0x3344",
"productId": "3928273748"

返回值:
{
  "uid": "0x3344",
  "status": true,
  "cards": [{
    "status": "valid",
    "_id": "5ce0de9f7b038e261bc7925d",
    "productId": "3928273748",
    "manufactTime": "2019年8月25日",
    "charInfo1": "aaaaaaaaaaaaa嘟嘟的度",
    "charInfo2": "bbbbbbbbbbbbb嘟嘟的度",
    "charInfo3": "ccccccccccccc嘟嘟的度",
    "imgInfo1": "393827283939.jpg",
    "imgInfo2": "393937394993.jpeg",
    "__v": 0
  }]
}
================================================================
}'
* */
router.post('/info', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let productId = req.body.productId;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.
        let result = await modelOpts.getProductInfoSync(productId);
        ret = {
            uid: uid,
            status: true,
            cards: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

module.exports = router;
