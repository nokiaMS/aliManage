'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/**
 * 添加待上链产品信息.
 */
router.post('/add', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let productId = req.body.productId;
    let charInfos = req.body.charInfos;
    let imgInfos = req.body.imgInfos;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let productInfo = {
            productId:productId,
            charInfos: charInfos,
            imgInfos: imgInfos,
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

/**
 * 获得产品信息.
 */
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
            productInfo: result
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
    let productId = req.body.productId;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.
        let result = await modelOpts.updateProductByIdSync(productId,{status: 'onChain'});
        ret = {
            uid: uid,
            status: true,
            productInfo: result
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
        let result = await modelOpts.getWaitingOnChainProductSync(parseInt(page), parseInt(count));
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

module.exports = router;
