/*
 * @Author: qiuziz
 * @Date: 2017-05-11 15:44:24
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-23 17:50:32
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

// sheen()

app.use('/', express.static('app'));
app.use('/photo', express.static('app'));
app.use('/photo/jandan', express.static('jandan'));
app.use('/sheen', express.static('app'));
app.use('/sheen/sheen', express.static('sheen'));

app.use('/jandan/images', require('./utils/jandan-api.js'));
app.use('/sheen/images', require('./utils/sheen-api.js'));
app.get('/sheen', function(req, res) {
   res.sendfile('./app/sheen.html');
});
app.get('/', function(req, res) {
   res.sendfile('./app/jandan.html');
});
app.get('/photo', function(req, res) {
   res.sendfile('./app/jandan.html');
});
http.createServer(app).listen(port);


