/*
 * @Author: qiuz
 * @Date: 2017-05-15 19:50:58
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-10-17 12:58:57
 */

const express = require("express"),
		router = express(),
    connect = require("./db.js"),
    ObjectID = require('mongodb').ObjectID;

let lastPageId = null;

router.get("/images", (req, res) => {
  const page = req.query.page || 0;
  console.log(page)
  if (page === 1) {
    lastPageId = null;
  }
  connect((err, db) => {
		//连接到表 jandan
		const collection = db.collection('jandan');
    //查询数据库
    const query = lastPageId ? {_id : { '$lt' :  lastPageId} } : {};
		collection.find(query).limit(10).sort({_id: -1}).toArray(function(err,doc){
			if (err) {
				console.log('------------',err);
        res.status(502).send('fetch error')
				return;
      }
      console.log(lastPageId);
      lastPageId = doc[doc.length - 1] && doc[doc.length - 1]._id;
			res.send(doc);
    })
	})
});

router.post("/like", (req, res) => {
  const params = req.body;
  connect((err, db) => {
		//连接到表 jandan
		const collection = db.collection('jandan');
    //查询数据库
		collection.findOne({src: params.src}, function(err,doc) {
			if (err) {
				console.log(err);
        res.status(502).send('fetch error')
				return;
      }
       //插入数据库
       collection.updateOne({src: params.src}, {
        $set: {...doc, like: params.userId }
        }, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
      });
			res.send(doc);
    })
	})
});

router.post("/unlike", (req, res) => {
  const params = req.body;
  connect((err, db) => {
		//连接到表 jandan
		const collection = db.collection('jandan');
    //查询数据库
		collection.findOne({src: params.src, userId: params.userId}, function(err,doc) {
			if (err) {
				console.log(err);
        res.status(502).send('fetch error')
				return;
      }
       //插入数据库
       collection.updateOne({src: params.src}, {
        $set: {...doc, like: '' }
        }, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
      });
			res.send(doc);
    })
	})
});

router.post("/like/list", (req, res) => {
  const params = req.body;
  if (params.page === 1) {
    lastPageId = null;
  }
  if (!params.userId) {
    res.status(400).send('userId couldt null');
    return;
  }
  connect((err, db) => {
		//连接到表 jandan
		const collection = db.collection('jandan');
    //查询数据库
    const query = lastPageId ? {_id : { '$lt' :  lastPageId}, like: params.userId } : {like: params.userId};
		collection.find(query).limit(10).sort({_id: -1}).toArray(function(err,doc){
			if (err) {
				console.log(err);
        res.status(502).send('fetch error')
				return;
      }
      lastPageId = doc[doc.length - 1] && doc[doc.length - 1]._id;
			res.send(doc);
    })
	})
});

router.post("/login", (req, res) => {
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
      });
			res.send({errorMsg: '', token, userId: doc._id, userName: doc.username, auth: doc.auth});
    })
	})
});

router.post("/delete", (req, res) => {
	const { src, userId } = req.body;

  if (!src) {
    res.send({errorMsg: 'src is null'});
    return;
  }
  if (!userId) {
    res.send({errorMsg: 'userId couldt null'});
    return;
  }
  connect((err, db) => {
		//连接到表 user
		const collection = db.collection('user');
    //查询数据库
    const query = {_id: ObjectID(userId)};
		collection.findOne(query, function(err, doc){
			if (err) {
				console.log(err);
        res.status(502).send('fetch error')
				return;
      }
      if (!doc) {
        res.send({errorMsg: 'user is null'});
        return;
      }
      if (doc.auth !== 'admin') {
        res.send({errorMsg: 'user do not have permission'});
        return;
      }
       //删除
       const jandanCol = db.collection('jandan');
       jandanCol.deleteOne({src}, function(err, result) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
      });
			res.send({errorMsg: ''});
    })
	})
})

module.exports = router
