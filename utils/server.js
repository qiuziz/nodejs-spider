/*
 * @Author: qiuz
 * @Date: 2017-05-11 15:44:24
 */

const http = require('http'),
		express = require('express'),
		jandan = require('./jandan.js');

const app = express();

// const pageUrl = 'https://jandan.net/ooxx';
const port = process.env.PORT || 4200;

// jandan(pageUrl);

app.use('/jandan/images', require('./jandan-api.js'));

http.createServer(app).listen(port);


