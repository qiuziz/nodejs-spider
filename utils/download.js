/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-12-08 16:30:30
 */

var fs = require('fs'),
		superagent = require("superagent"),
		connect = require('./db.js');
		saveToGoogleDrive = require('./googleapi.js');

var dir = './app/jandan';
var curCount = 0;
function download(url, callback) {
	//延迟毫秒数
	var delay = parseInt((Math.random() * 30000000) % 10000, 10);
	curCount++;
	console.log(new Date() + '现在的并发数是', curCount, '，正在抓取的是', url, '，估计耗时' + delay + '毫秒');  
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
			db.close();
			console.log('result:', result);
			if (result) return;
			if (fsExistsSync(dir + '/' + filename)) {
				curCount--;
				callback(null, dir + '/' + filename);
				console.log(filename + '已存在');
				return 
			} else {
				var writeStream = fs.createWriteStream(dir + '/' + filename);
				writeStream.on('error', function(err) {
					console.log(err);
					writeStream.end();
				});
				setTimeout(function() {
					superagent.get(url).on('error', function(err){
						console.log(err);
					}).pipe(writeStream).on('close', function() {
						saveToGoogleDrive(filename, dir + '/' + filename);
						console.log(filename + '已下载');
						
						curCount--;
						callback(null, dir + '/' + filename);
					});
				}, delay);
			}
		})
	})
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