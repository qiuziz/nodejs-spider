/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2018-09-18 09:57:22
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-10-17 15:23:21
 */

const MongoClient = require('mongodb').MongoClient,
  DB_CONN_STR = 'mongodb://su_qiuz:64UwMRNonw%40jiG@mongo:20717/photo?authSource=admin';

function connect(callback) {
    MongoClient.connect(DB_CONN_STR, {useNewUrlParser: true}, async function(err, client) {
        if (!err) {
          const db = client.db('photo');
          await callback(err, db);
          client.close();
        }
        else throw err;
    });
}

module.exports = connect;
