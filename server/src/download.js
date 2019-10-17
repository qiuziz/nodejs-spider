/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 */

const connect = require('./db.js');

Date.prototype.format = function (format) {
	let args = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
		'S': this.getMilliseconds()
	};
	if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)); }
	for (let i in args) {
		let n = args[i];
		if (new RegExp('(' + i + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)); }
	}
	return format;
};

function download(url, callback) {
	connect((err, db) => {
		//连接到表 jandan
    const collection = db.collection('jandan');
    //插入数据库
		collection.findOne({ src: url }, function(err, result) {
			if(err)
			{
					console.log('Error:'+ err);
					return;
			}
			if (result) {
        // console.log(url + '已存在');
        callback(null, url);
        db.close();
				return;
			} else {
        collection.insert({ src: url, createTime: new Date().format("yyyy-MM-dd hh:mm:ss") }, function(err, result) {
          if(err)
          {
              console.log('Error:'+ err);
              db.close();
              return;
          }
          db.close();
        });
        callback(null, url);
			}
		})
	})
}

module.exports = download
