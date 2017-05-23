/*
 * @Author: qiuziz
 * @Date: 2017-05-17 20:12:03
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-23 18:03:57
 */

var	connect = require('./db.js'),
		fs = require('fs');

var path = process.cwd() + '/app/sheen';


function sheen() {
	fs.readdir(path, 'utf8', function(err, files){
	if (err) {
			return console.error(err);
	}
	files.forEach(function(filename) {
		var name = escape(filename);
		// fs.rename(path + '/' + filename, path + '/' + name, function(err){
		// 	if (err) console.error('Error' + err);
		// })
		connect(function(err, db) {
				//连接到表 sheen
					var collection = db.collection('sheen');
					//插入数据库
					collection.save({ _id:name, images: './sheen/' + name, disc: filename }, function(err, result) {
						if(err)
						{
								console.log('Error:'+ err);
								return;
						}
						db.close();
					})
			})
	})
});

}

sheen();

// module.exports = sheen;