/*
 * @Author: qiuz
 * @Date: 2017-05-15 19:50:58
 * @Last Modified by: qiuz
 * @Last Modified time: 2018-10-08 09:50:09
 */

const express = require("express"),
		router = express(),
		connect = require("./db.js");

let lastPageId = null;

router.get("/", (req, res) => {
	const page = req.query.page || 0;
  connect((err, db) => {
		//连接到表 jandan
		const collection = db.collection('jandan');
    //查询数据库
    const query = lastPageId ? {_id : { '$lt' :  lastPageId} } : {};
		collection.find(query).limit(10).sort({_id: -1}).toArray(function(err,doc){
			if (err) {
				console.log(err);
			  db.close();
        res.status(502).send('fetch error')
				return;
      }
      db.close();
      lastPageId = doc[doc.length - 1] && doc[doc.length - 1]._id;
			res.send(doc);
    })
	})
})

module.exports = router
