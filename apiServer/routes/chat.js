'use strict'

let express = require('express');
let router = express.Router();
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/**
 * 创建聊天室.
 */
router.post('/create', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let creator = req.body.creator;
    let roomName = req.body.roomName;
    let maxCount = req.body.maxCount;
    let roomType = req.body.roomType;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否已经登录,只有登录用户才能登出.
        let randomNum = stringRandom(8, '123456789');
        let chatInst = {
            chatId: randomNum,
            chatName: roomName,
            creator: creator,
            roomType: roomType,
            maxCount: maxCount,
            createTime: Date.now()
        }
        let result = await modelOpts.saveChatSync(chatInst);

        let ret = {
            uid: uid,
            status: true,
            errCode: "0x10000",
            result: result
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/**
 * 加入聊天室.
 */
router.post('/join', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let chatId = req.body.code;
    let ret;

    try {
        //2. 检查参数有效性,参数无效抛出异常.

        //3. 检查用户是否存在,不存在用户不能加入聊天室.
        //4. 检查用户是否登录,非登录用户不能执行此操作.
        /*
        let userInDB = await modelOpts.getUserByNameSync(user);
        if(userInDB.length === 0) {     //用户不存在,返回错误给客户端.
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20015"
            }
        } else if(userInDB[0].status !== 'active') {
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20017"
            }
        } else { */
            //加入聊天室.
            let chat = await modelOpts.getChatSync(chatId);
            if(chat.length === 0) {
                ret = {
                    uid: uid,
                    status: "false",
                    errCode: "0x20018"
                }
            } else {
                //获得当前聊天室成员列表.
                let userList = chat[0].userList;
                userList.push(user)
                await modelOpts.updateChatByIdSync(chatId,{userList: userList})

                let relation = {
                    userName: user,
                    chatId: chatId
                }
                await modelOpts.saveChatRelationSync(relation)

                ret = {
                    uid: uid,
                    status: "true",
                    errCode: "0x10000"
                }
            }
        //}
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/**
 * 获取聊天室基本信息.
 */
router.post('/detail', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let chatId = req.body.code;
    let ret;

    try {
        let chat = await modelOpts.getChatSync(chatId);
        if(chat.length === 0) {
            ret = {
                uid: uid,
                status: "false",
                errCode: "0x20018"
            }
        } else {
            //获得当前聊天室成员列表.
            ret = {
                uid: uid,
                chatInfo: chat
            }
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/**
 * 获取聊天室列表.
 */
router.post('/list', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let ret;

    try {
        let chatRelation = await modelOpts.getChatRelationSync(user);
        ret = {
            uid: uid,
            chatRooms: chatRelation
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chat/message' --data '{
"uid": "0x5",
"chatId": "14877912",
"sender":"Jerraba",
"msgType": "char",
"content": "This is a message for chat."
}'

返回结果:
{
  "uid": "0x5",
  "status": true,
  "errCode": "0x10000"
}
* */
router.post('/message', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let chatId = req.body.chatId;
    let sender = req.body.sender;
    let msgType = req.body.type;
    let content = req.body.content;

    let ret;

    try {
        let chatroom = await modelOpts.getChatSync(chatId)
        let maxMessageIndex = chatroom[0].latestMessageIndex + 1;
        await modelOpts.updateChatByIdSync(chatId,{latestMessageIndex: maxMessageIndex})
        let messageInst = {
            messageId: maxMessageIndex,
            chatId: chatId,
            user: sender,
            messageType: msgType,
            createTime: Date.now(),
            content: content
        }
        await modelOpts.saveChatMessageSync(messageInst);
        ret = {
            uid: uid,
            status: true,
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
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chat/messages' --data '{
"uid": "0x5",
"chatId": "14877912",
"user":"Jerraba",
"from": "20",
"to": "30"
}'

返回结果:
{
  "uid": "0x5",
  "messages": [{
    "status": "normal",
    "_id": "5ce3cdd657650d6a44c2c5ad",
    "messageId": 20,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:18.425Z",
    "content": "This is a message ddd for chat5.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cdd957650d6a44c2c5ae",
    "messageId": 21,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:21.598Z",
    "content": "This is a message ddd for chat6.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cddc57650d6a44c2c5af",
    "messageId": 22,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:24.709Z",
    "content": "This is a message ddd for chat7.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cde057650d6a44c2c5b0",
    "messageId": 23,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:28.243Z",
    "content": "This is a message ddd for chat8.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cde357650d6a44c2c5b1",
    "messageId": 24,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:31.803Z",
    "content": "This is a message ddd for chat9.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cde857650d6a44c2c5b2",
    "messageId": 25,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:36.053Z",
    "content": "This is a message ddd for chat10.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cdea57650d6a44c2c5b3",
    "messageId": 26,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:38.915Z",
    "content": "This is a message ddd for chat11.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cdee57650d6a44c2c5b4",
    "messageId": 27,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:42.572Z",
    "content": "This is a message ddd for chat12.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cdf457650d6a44c2c5b5",
    "messageId": 28,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:48.557Z",
    "content": "This is a message ddd for chat13.",
    "__v": 0
  }, {
    "status": "normal",
    "_id": "5ce3cdf857650d6a44c2c5b6",
    "messageId": 29,
    "chatId": "14877912",
    "user": "Jerraba",
    "createTime": "2019-05-21T10:07:52.095Z",
    "content": "This is a message ddd for chat14.",
    "__v": 0
  }]
}
* */
router.post('/messages', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let user = req.body.user;
    let chatId = req.body.chatId;
    let from = req.body.from;
    let to = req.body.to;

    let ret;

    try {
        let messages = await modelOpts.getChatMessagesSync(chatId, user, parseInt(from), parseInt(to));
        ret = {
            uid: uid,
            messages: messages
        }
        res.header("Access-Control-Allow-Origin", "*");     //添加跨域标识.
        res.send(ret);
    } catch(e) {
        console.log("Error happened,");
        console.log(e);
    }
});

/*
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chat/sign' --data '{
"uid": "0x5",
"chatId": "14877912",
"user":"Jerraba",
"from": "20",
"to": "30",
"signerList": [
    "aaa",
    "bbb",
    "ccc",
    "ddd"]
}'
返回结果:
{
  "uid": "0x5",
  "status": true,
  "errCode": "0x10000"
}
* */
router.post('/sign', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let sender = req.body.sender;
    let chatId = req.body.chatId;
    let from = req.body.from;
    let to = req.body.to;
    let signerList = req.body.signerList;

    let ret;

    try {
        let signInst = {
            user: sender,
            chatId: chatId,
            signerList: signerList,
            from: parseInt(from),
            to: parseInt(to)
        }
        let messages = await modelOpts.saveChatSignInfoSync(signInst);
        ret = {
            uid: uid,
            status: true,
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
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chat/signNotification' --data '{
"uid": "0x5",
"chatId": "14877912",
"sender": "Jerraba"
}'

返回结果:
{
  "uid": "0x5",
  "chatNotification": [{
    "status": "normal",
    "signerList": ["aaa", "bbb", "ccc", "ddd"],
    "from": 20,
    "to": 30,
    "signedList": [],
    "_id": "5ce3d8cbe533906ce8cbbca8",
    "chatId": "14877912",
    "__v": 0
  }]
}
* */
router.post('/signNotification', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let sender = req.body.sender;
    let chatId = req.body.chatId;

    let ret;

    try {
        let chatNotification = await modelOpts.getChatSignNotificationSync(chatId, sender);
        if(chatNotification.length === 0 ) { //没有需要签名的消息.
            ret = {
                uid: uid,
                status: true,
                errCode: "0x20019"      //没有要签名的消息.
            }
        } else if(chatNotification[0].status === "done") {
            ret = {
                uid: uid,
                status: true,
                errCode: "0x20020"      //聊天信息已经签名完成.
            }
        } else {
            ret = {
                uid: uid,
                chatNotification: chatNotification
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
curl -X POST -H 'Content-Type: application/json' -i 'http://127.0.0.1:3000/chat/confirm' --data '{
"uid": "0x5",
"chatId": "14877912",
"sender": "aaa"
}'

返回结果:

* */
router.post('/confirm', async function(req, res) {
    //1.获得req中的参数.
    let uid = req.body.uid;
    let sender = req.body.sender;
    let chatId = req.body.chatId;

    let ret;

    try {
        let chatNotification = await modelOpts.getChatSignNotificationSync(chatId, sender);
        if(chatNotification.length === 0 ) { //没有需要签名的消息.
            ret = {
                uid: uid,
                status: true,
                errCode: "0x20019"      //没有要签名的消息.
            }
        } else if(chatNotification[0].status === "done") {
            ret = {
                uid: uid,
                status: true,
                errCode: "0x20020"      //聊天信息已经签名完成.
            }
        } else {
            let signerList = chatNotification[0].signerList;
            let signedList = chatNotification[0].signedList;
            if(!signedList.includes(sender) && signerList.includes(sender)) {
                signedList.push(sender)
            }
            //检查是否已经全部签名完成,如果签名签名完成则消息上链.
            let done = true;
            for(var i=0;i< signerList.length;i++) {
                if(!signedList.includes(signerList[i])) {
                    done = false;
                    break;
                }
            }
            if(done === true) {
                await modelOpts.updateChatSignByIdSync(chatId, {status: "onchain"});
            }
            ret = {
                uid: uid,
                status: true,
                errCode: "0x10000"      //聊天信息已经签名完成.
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
