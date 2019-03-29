/*
 * @Author: qiuz
 * @Date: 2017-05-15 19:50:58
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-03-29 10:08:03
 */

const express = require("express"),
		router = express(),
		connect = require("./db.js");

let lastPageId = null;

router.get("/images", (req, res) => {
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
});

router.post("/login", (req, res) => {
  console.log(req.body);
	const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    res.send({errorMsg: 'username is null'});
    return;
  }
  if (!password) {
    res.send({errorMsg: 'password is null'});
    return;
  }
  connect((err, db) => {
		//连接到表 user
		const collection = db.collection('user');
    //查询数据库
    const query = {username, password};
		collection.findOne(query, function(err, doc){
			if (err) {
				console.log(err);
			  db.close();
        res.status(502).send('fetch error')
				return;
      }
      if (!doc) {
        res.send({errorMsg: 'username or password is error'});
        return;
      }
      const token = Math.random().toString(36).slice(-8);
       //插入数据库
       collection.updateOne(query, {
          $set: {...doc, token }
        }, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        db.close();
      });
      db.close();
			res.send({errorMsg: '', token});
    })
	})
})

module.exports = router
