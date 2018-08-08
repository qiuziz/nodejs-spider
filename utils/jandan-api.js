/*
 * @Author: qiuziz
 * @Date: 2017-05-15 19:50:58
 * @Last Modified by: qiuz <https://github.com/qiuziz>
 * @Last Modified time: 2018-08-08 15:24:36
 */

/*
 * @Author: qiuziz
 * @Date: 2017-04-28 21:17:30
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-10 11:05:29
 */

const express = require("express"),
		router = express(),
		connect = require("./db.js");

router.get("/", (req, res) => {
	const page = req.query.page || 0;
  connect((err, db) => {
		//连接到表 jandan
		const collection = db.collection('jandan');

		//查询数据库
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
