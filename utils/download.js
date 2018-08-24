/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 */

const connect = require('./db.js');

function getNextSequenceValue(sequenceName, collection){
  const sequenceDocument = collection.findAndModify(
     {
        query:{id: sequenceName },
        update: {$inc:{id:1}},
        "new":true
     });
  return sequenceDocument.id;
}

function download(url, callback) {
  const arr = url.split('/'), filename = arr[arr.length - 1];

	connect((err, db) => {
		//连接到表 jandan
    const collection = db.collection('jandan'), id = filename.split('.')[0]
		//插入数据库
		collection.findOne({ src: url }, function(err, result) {
			if(err)
			{
					console.log('Error:'+ err);
					return;
			}
			if (result) {
        callback(null, filename);
        db.close();
				return;
			} else {
        collection.insert({ src: url }, function(err, result) {
          if(err)
          {
              console.log('Error:'+ err);
              db.close();
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
