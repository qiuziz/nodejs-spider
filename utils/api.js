/*
 * @Author: qiuziz
 * @Date: 2017-05-15 19:50:58
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-16 10:32:31
 */

/*
 * @Author: qiuziz
 * @Date: 2017-04-28 21:17:30
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-10 11:05:29
 */

var express = require("express"),
		router = express(),
		connect = require("./db.js");

router.get("/", (req, res) => {
	var id = req.query.id || 1;
	var page = req.query.page || 0;
  connect((err, db) => {
		//连接到表 jandan
		var collection = db.collection('jandan');
		
		//查询数据库
		console.log('page: ' + page);
		collection.find().limit(10).skip(Number(page) * 10).toArray(function(err,doc){
			if (err) {
				console.log(err);
			  db.close();
        res.status(502).send('fetch error')
				return;
			}
			db.close();
			res.send(doc);
		})
	})
})

module.exports = router