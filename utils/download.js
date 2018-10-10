/*
 * @Author: qiuziz
 * @Date: 2017-05-11 17:16:21
 */

const connect = require('./db.js');

function download(urls) {
  urls = urls.map(url => {
    return {src: url};
  });
  console.log(urls);
	connect((err, db) => {
		//连接到表 jandan
    const collection = db.collection('jandan');
    //插入数据库

      collection.insert(urls, { ordered: false }, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            db.close();
            return;
        }
        db.close();
      });
	})
}

module.exports = download
