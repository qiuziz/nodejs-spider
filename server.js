/*
 * @Author: qiuziz
 * @Date: 2017-05-11 15:44:24
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-12-08 23:37:33
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
var pageUrl = 'http://jandan.net/ooxx';
var port = process.env.PORT || 4000;


jandan(pageUrl);

app.use(express.static(__dirname + '/app'));
app.use('/photo', express.static('app'));
app.use('/jandan/images', require('./utils/jandan-api.js'));

app.get('/', function(req, res) {
   res.sendFile(__dirname  + '/app/jandan.html');
});

app.get('/photo', function(req, res) {
   res.sendFile(__dirname  + '/app/jandan.html');
});
http.createServer(app).listen(port);


