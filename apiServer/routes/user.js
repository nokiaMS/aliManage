var express = require('express');
var router = express.Router();
let modelOpts = require('../db/modelOpts');

router.post('/info/password',  async function (req, res) {
    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let name = req.body.nickName;
    let password = req.body.password;
    let code = req.body.code;

    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 返回用户基本信息.
        let userInDB = await modelOpts.getUserByNameSync(name);
        if(userInDB.length === 0) {     //用户不存在,返回空给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20013"             //用户不存在.
            }
        } else {
            await modelOpts.updateUserByNameSync(userInDB[0].nickName, {password: password});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"  //成功.
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
guoxu@ubuntu:~/software/WebStorm-182.3911.37/bin$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/user/info/phone' --data '{"uid":"0x2244","oldPhone":"13499884758","newPhone":"90876543212","code":"213456"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-p3wZcUTO2HT5argQ6o7I/sJX3ZQ"
Date: Sat, 11 May 2019 11:45:58 GMT
Connection: keep-alive

{"uid":"0x2244","status":"true","errCode":"0x10000"}
guoxu@ubuntu:~/software/WebStorm-182.3911.37/bin$
*/
router.post('/info/phone',  async function (req, res) {
    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let oldPhone = req.body.oldPhone;
    let newPhone = req.body.newPhone;
    let code = req.body.code;

    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 返回用户基本信息.
        let userInDB = await modelOpts.getUserByPhoneSync(oldPhone);
        if(userInDB.length === 0) {     //用户不存在,返回空给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20013"             //用户不存在.
            }
        } else {
            await modelOpts.updateUserByNameSync(userInDB[0].nickName, {mobilePhone: newPhone});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"  //成功.
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
*
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/user/partner/unbind' --data '{"uid":"0x2244","nickName":"Jerraba"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-p3wZcUTO2HT5argQ6o7I/sJX3ZQ"
Date: Sat, 04 May 2019 11:06:52 GMT
Connection: keep-alive

{"uid":"0x2244","status":"true","errCode":"0x10000"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
* */
router.post('/partner/unbind',  async function (req, res) {
    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let nickName = req.body.nickName;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 返回用户基本信息.
        let userInDB = await modelOpts.getUserByNameSync(nickName);
        if(userInDB.length === 0) {     //用户不存在,返回空给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20013"             //用户不存在.
            }
        } else {
            await modelOpts.updateUserByNameSync(nickName, {partner: ""});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"  //成功.
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
*
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/user/partner/bind' --data '{"uid":"0x2244","nickName":"Jerraba","partner": "13499884758"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-p3wZcUTO2HT5argQ6o7I/sJX3ZQ"
Date: Sat, 04 May 2019 11:01:27 GMT
Connection: keep-alive

{"uid":"0x2244","status":"true","errCode":"0x10000"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
=================================================================================
* */
router.post('/partner/bind',  async function (req, res) {
    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let nickName = req.body.nickName;
    let partner = req.body.partner;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 返回用户基本信息.
        let srcUser = await modelOpts.getUserByNameSync(nickName);
        let userInDB = await modelOpts.getUserByPhoneSync(partner);
        if(srcUser.length === 0) {
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20013"
            }
        } else if(userInDB.length === 0) {     //用户不存在,返回空给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20016"             //绑定用户不存在.
            }
        } else {
            await modelOpts.updateUserByNameSync(nickName, {partner: partner});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x10000"  //绑定成功.
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
* 用户基本信息查询api.
*
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/user/info/base' --data '{"uid":"0x2244","nickName":"Jerraba"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 105
ETag: W/"69-da/Zx/6WPsLfjdQECMM7OXT67cQ"
Date: Sat, 04 May 2019 10:38:28 GMT
Connection: keep-alive

{"uid":"0x2244","userInfo":{"nickName":"Jerraba","phone":"13499884758","partner":"","status":"inactive"}}
guoxu@ubuntu:~/gx/aliManage/apiServer$
=======================================================================

guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST -H 'Content-Type: application/json' -i 'http://127..0.1:3000/user/info/base' --data '{"uid":"0x2244","nickName":"Jerrcccaba"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 16
ETag: W/"10-CKT77JnOOwd5sXkE3lYdkPJ0aGs"
Date: Sat, 04 May 2019 10:39:18 GMT
Connection: keep-alive

{"uid":"0x2244"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
======================================================================
* */
router.post('/info/base',  async function (req, res) {
    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let nickName = req.body.nickName;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 返回用户基本信息.
        let userInDB = await modelOpts.getUserByNameSync(nickName);
        if(userInDB.length === 0) {     //用户不存在,返回空给客户端.
            ret = {
                uid: uid
            }
        } else {
            ret = {
                uid: uid,
                userInfo: {
                    nickName: userInDB[0].nickName,
                    phone: userInDB[0].mobilePhone,
                    sex: userInDB[0].sex,
                    age: userInDB[0].age,
                    partner: userInDB[0].partner,
                    status: userInDB[0].status
                }
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
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST.0.1:3000/user/logout' --data '{"uid":"0x2244","nickName":"Jerraba"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-Ph8ufcAUBa9/y6nj59cKcscmf+o"
Date: Sat, 04 May 2019 10:20:47 GMT
Connection: keep-alive

{"uid":"0x2244","status":"true","errCode":"0x20014"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
====================================================================================================

guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST .0.1:3000/user/logout' --data '{"uid":"0x2244","nickName":"Jebbrraba"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 53
ETag: W/"35-B1CGuIbkTkKo7NJLruyWXlBvWIM"
Date: Sat, 04 May 2019 10:21:52 GMT
Connection: keep-alive

{"uid":"0x2244","status":"false","errCode":"0x20015"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
=======================================================================================================
* */
router.post('/logout',  async function (req, res) {
    let logoutTime = Date.now();

    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let nickName = req.body.nickName;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let userInDB = await modelOpts.getUserByNameSync(nickName);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else if(userInDB[0].status === "active") {    //用户已经登录
            await modelOpts.updateUserByNameSync(nickName, {logoutTime: logoutTime, status: "inactive"});
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
* 用户登录api.
* 测试用例:
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/user/login' --data '{"uid":"0x2233","nickName":"Jerraba","password":"123456"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 52
ETag: W/"34-HQ7Jxf7DzFNrD7u6av7OK3+0T8c"
Date: Sat, 04 May 2019 10:10:20 GMT
Connection: keep-alive

{"uid":"0x2233","status":"true","errCode":"0x20012"}
guoxu@ubuntu:~/gx/aliManage/apiServer$

=========================
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST .0.1:3000/user/login' --data '{"uid":"0x2233","nickName":"Jerraba","password":"123456"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 53
ETag: W/"35-EGpJ2URXqF4aFSKT65gwdtXSGR4"
Date: Sat, 04 May 2019 10:12:05 GMT
Connection: keep-alive

{"uid":"0x2233","status":"false","errCode":"0x20011"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
================================================================
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST.0.1:3000/user/login' --data '{"uid":"0x2233","nickName":"Jerbbbraba","password":"123456"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 53
ETag: W/"35-bnE0SXbJY1RrjNByYQiVLNEOQss"
Date: Sat, 04 May 2019 10:13:07 GMT
Connection: keep-alive

{"uid":"0x2233","status":"false","errCode":"0x20013"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
================================================================
* */
router.post('/login',  async function (req, res) {
    let loginTime = Date.now();

    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let nickName = req.body.nickName;
    let password = req.body.password;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,不能重复登录.
        let userInDB = await modelOpts.getUserByNameSync(nickName);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20013"
            }
        } else if(userInDB[0].status === "active") {    //用户已经登录
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20011"
            }
        } else {    //登录成功,更新数据库状态,并返回登录成功给用户.
            await modelOpts.updateUserByNameSync(nickName, {loginTime: loginTime, status: "active"});
            ret = {
                uid: uid,
                status: "true",
                errCode: "0x20012"
            }
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

router.get('/test', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
    res.send("This is a test api");
})
/*
* 用户注册api.
* 测试用例:
guoxu@ubuntu:~/gx/aliManage/apiServer$ curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/user/regist' --data '{"uid":"0x2222","nickName":"Jerraba","password":"123456","phone":"13499884758","code":"123456"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 111
ETag: W/"6f-yLVSkhONpwBIloM1x4wwJ9hQViE"
Date: Sat, 04 May 2019 08:53:32 GMT
Connection: keep-alive

{"uid":"0x2222","nickName":"Jerraba","phone":"13499884758","registTime":1556960012705,"loginStatus":"inactive"}
guoxu@ubuntu:~/gx/aliManage/apiServer$
* */
router.post('/regist',  async function (req, res) {
    let registTime = Date.now();

    //1. 获得用户传递的参数.
    let uid = req.body.uid;
    let phone = req.body.phone;
    let nickName = req.body.nickName;
    let password = req.body.password;
    let code = req.body.code;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 用户注册.
        let userInst = {
            nickName: nickName,
            password: password,
            verificationCode: code,
            mobilePhone: phone,
            registTime: registTime
        };
        await modelOpts.saveUserSync(userInst);
        let userInDB = await modelOpts.getUserByPhoneSync(phone);
        let user = userInDB[0];
        let ret = {
            uid: uid,
            nickName: nickName,
            phone: phone,
            sex: user.sex,
            age: user.age,
            partner: user.partner,
            registTime: user.registTime,
            loginStatus: user.status
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

module.exports = router;