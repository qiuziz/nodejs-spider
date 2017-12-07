/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-12-07 14:20:44
 */

var fs = require('fs'),
		superagent = require("superagent"),
		connect = require('./db.js');
		saveToGoogleDrive = require('./googleapi');

var dir = './app/jandan';
var curCount = 0;
function download(url, callback) {
	//延迟毫秒数
	var delay = parseInt((Math.random() * 30000000) % 1000, 10);
	curCount++;
	console.log('现在的并发数是', curCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');  
	var arr = url.split('/');
	var filename = arr[arr.length - 1];
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
		var req = superagent.get(url).on('error', function(err){
			console.log(err);
		}).pipe(writeStream).on('close', function() {
			var url = saveToGoogleDrive(filename, dir + '/' + filename);
			console.log(filename + '已下载');
			connect((err, db) => {
				//连接到表 jandan
					var collection = db.collection('jandan');
					//插入数据库
					var id = filename.split('.')[0];
					collection.save({ _id:id, images: url }, function(err, result) { 
						if(err)
						{
								console.log('Error:'+ err);
								return;
						}
						db.close();
					})
			})
			curCount--;
			callback(null, dir + '/' + filename);
		});
	}
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