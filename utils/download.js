/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 * @Last Modified by: qiuz <https://github.com/qiuziz>
 * @Last Modified time: 2018-08-07 18:07:27
 */

var fs = require('fs'),
		superagent = require("superagent"),
		connect = require('./db.js'),
		USER_AGENTS = require('./userAgents.js'),
		getProxy = require('./freeProxySpider.js'),
		PROXY_LIST = require('./proxys.js');
		// saveToGoogleDrive = require('./googleapi.js');

// getProxy();

var proxyNum = 0;

// 产生m 到 n 之间的随机数 and 不与之前的相等
function random(m, n, r) {
	var i = n - m;
	var f = Math.floor(Math.random() * i + m);
	return r ? (r === f ? random(m, n, r) : f) : f;
}

// HTTP, HTTPS, or SOCKS proxy to use
var proxy = process.env.http_proxy || 'http://168.63.43.102:3128';

function download(url, callback) {
	console.log('正在抓取的是', url);
	var arr = url.split('/');
	var filename = arr[arr.length - 1];
	connect((err, db) => {
		//连接到表 jandan
		var collection = db.collection('jandan');
		//插入数据库
		var id = filename.split('.')[0];
		collection.findOne({ _id: id }, function(err, result) {
			if(err)
			{
					console.log('Error:'+ err);
					return;
			}
			console.log('result:', result);
			if (result) {
				callback(null, filename);
        console.log(filename + '已存在');
        db.close();
				return
			} else {
        collection.save({ _id:id, images: url }, function(err, result) {
          if(err)
          {
              console.log('Error:'+ err);
              return;
          }
          db.close();
        });
        callback(null, filename);
			}
		})
	})
}

function getUrl(url) {
	if (proxyNum >= PROXY_LIST.length - 1) {
		getProxy();
		proxyNum = 0;
	}
	const proxy = PROXY_LIST[proxyNum++];
	console.log(proxy);
	const req = superagent.get(url).set('User-Agent', USER_AGENTS[random(0, USER_AGENTS.length)])
	.proxy(proxy)
	.on('error', function(err) {
		console.log(err);
		req.abort();
		getUrl(url);
	})
	.then(res => {
		/* responded in time */
		}, err => {
			console.log(err);
			if (err.timeout) {
				/* timed out! */
				getUrl(url);
			} else { /* other error */ getUrl(url);}
	})
	return req
}


//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

module.exports = download
