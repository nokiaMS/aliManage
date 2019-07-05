'use strict'

let express = require('express');
let router = express.Router();
let fs = require("fs");
let path = require("path");
let multer = require('multer');
let utils = require('../utils/utils');
let modelOpts = require('../db/modelOpts');
let stringRandom = require('string-random');

/* Image upload.
*  unbuntu上rest api测试工具: insomnia
*  配置方法:
*   POST http://127.0.0.1:3000/fileOperations/upload
*   选取Multipart Form, 然后点击三角按钮,选择文件项之后,再选择需要的具体文件.
*   Header: ContentType为 multipart/form-data.
*   配置完成只有选择发送按钮就发送出去了.
*
*   返回值如下:
*   {
        "mimetype": "image/jpeg",
        "originalname": "img1.jpeg",
        "size": 60030,
        "filename": "c714f8e8dbebf9c07e0e7f9d3058d414"
    }
* */
router.post('/upload', multer({
    //设置文件存储路径
    dest: 'upload'   //upload文件如果不存在则会自己创建一个。
}).any(), function (req, res, next) {
    if (req.files.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
        res.render("error", {message: "上传文件不能为空！"});
        return
    } else {
        let file = req.files[0];
        let fileInfo = {};
        //console.log(file);
        //fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname);//这里修改文件名字，比较随意。
        // 获取文件信息
        fileInfo.mimetype = file.mimetype;
        fileInfo.originalname = file.originalname;
        fileInfo.size = file.size;
        fileInfo.filename = file.filename;

        // 设置响应类型及编码
        res.set({
            'content-type': 'application/json; charset=utf-8'
        });

        res.send(fileInfo);
    }
});

/*
POST http://127.0.0.1:3000/fileOperations/download
BODY内容如下:
{
	"fileName" : "6c15efaab95c7cecb58be99ac6a80a1c"
}
* */
router.post('/download', function (req, res) {
        let fileName = req.body.fileName;
        let fileStr = "./upload/" + fileName
        res.download(fileStr)
});

/**
 * Get 方式下载文件.
 */
router.get('/download', function (req, res) {
    let fileId = req.query.id
    let fileStr = "./upload/" + fileId
    res.download(fileStr)
})

module.exports = router;
