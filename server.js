/*
 * @Author: qiuziz
 * @Date: 2017-05-11 15:44:24
 * @Last Modified by: qiuz <https://github.com/qiuziz>
 * @Last Modified time: 2018-08-08 09:39:28
 */

var http = require('http'),
		superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require('eventproxy'),
		download = require('./utils/download.js'),
		connect = require('./utils/db.js'),
		express = require('express'),
		jandan = require('./utils/jandan.js');

var app = express();

// var ep = new eventproxy();
var pageUrl = 'https://jandan.net/ooxx';
var port = process.env.PORT || 8080;


jandan(pageUrl);

// app.use(express.static(__dirname + '/app'));
// app.use('/app', express.static('app'));
// app.use('/photo/jandan', express.static('jandan'));
app.use('/jandan/images', require('./utils/jandan-api.js'));

// app.get('/', function(req, res) {
//    res.sendFile(__dirname  + '/app/jandan.html');
// });

// app.get('/photo', function(req, res) {
//    res.sendFile(__dirname  + '/app/jandan.html');
// });
http.createServer(app).listen(port);


