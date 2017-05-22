/*
 * @Author: qiuziz
 * @Date: 2017-05-02 17:44:26
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-19 17:17:46
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://qiuziz:123456@localhost:27017/jandan-photo'; 
 
var insertData = function(db, callback) { 
    //连接到表 site
    var collection = db.collection('site');
		
    //插入数据
    var data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}

 
function connect(callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (!err) callback(err, db);
    });
}

module.exports = connect;
