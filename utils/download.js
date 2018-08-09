/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 */

const connect = require('./db.js');

function download(url, callback) {
	console.log('图片地址：', url);
  const arr = url.split('/'), filename = arr[arr.length - 1];

	connect((err, db) => {
		//连接到表 jandan
    const collection = db.collection('jandan'), id = filename.split('.')[0]

		//插入数据库
		collection.findOne({ _id: id }, function(err, result) {
			if(err)
			{
					console.log('Error:'+ err);
					return;
			}
			if (result) {
        callback(null, filename);
        console.log(filename + '已存在');
        db.close();
				return;
			} else {
        collection.save({ _id:id, src: url }, function(err, result) {
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

module.exports = download
