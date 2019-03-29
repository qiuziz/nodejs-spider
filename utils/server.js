/*
 * @Author: qiuz
 * @Date: 2017-05-11 15:44:24
 */

const http = require('http'),
    express = require('express'),
    // 引入json解析中间件
    bodyParser = require('body-parser');


const app = express();

// const pageUrl = 'https://jandan.net/ooxx';
const port = process.env.PORT || 4200;

// jandan(pageUrl);

// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/jandan/', require('./jandan-api.js'));

http.createServer(app).listen(port);


