/*
 * @Author: qiuziz
 * @Date: 2017-05-11 15:44:24
 */

const http = require('http'),
		express = require('express'),
		jandan = require('./utils/jandan.js');

const app = express();

const pageUrl = 'https://jandan.net/ooxx';
const port = process.env.PORT || 8080;

jandan(pageUrl);

app.use('/jandan/images', require('./utils/jandan-api.js'));

http.createServer(app).listen(port);


