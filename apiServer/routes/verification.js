'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/* send SMS
*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/verification/sms' --data '{
"uid":"0x333",
"phone":"13910754971",
"usage":"regist"
}
'

返回值:
{"uid":"0x333","status":"true","errCode":"0x10000"}
* */
router.post('/sms', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let phone = req.body.phone;
    let usage = req.body.usage;

    //2.检查参数有效性.
    try {
        //3.生成验证码并存储数据库.
        let randomNum = stringRandom(8, '123456789'); //生成8位随机数字.
        //4.存储电话和数字到数据库.
        await modelOpts.updateSMS(phone, randomNum);
        //5.调用短信接口发送短信.
        await utils.sendVerificationCode(randomNum,phone);
        let ret = {
            uid: uid,
            status: "true",
            errCode: "0x10000"
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;
