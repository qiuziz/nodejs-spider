/*
 * @Author: qiuziz
 * @Date: 2017-05-02 17:44:26
 * @Last Modified by: qiuz <https://github.com/qiuziz>
 * @Last Modified time: 2018-08-08 15:22:19
 */
const MongoClient = require('mongodb').MongoClient,
  DB_CONN_STR = 'mongodb://localhost:27017/photo';

function connect(callback) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (!err) callback(err, db);
    });
}

module.exports = connect;
