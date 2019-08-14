/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-09 15:29:46
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-14 13:44:54
 */

const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
	const { page = 0, where = {} } = event;
	// 1. 获取数据库引用
	const db = cloud.database()
	// 2. 构造查询语句
	// collection 方法获取一个集合的引用
	// where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
	// get 方法会触发网络请求，往数据库取数据
  return await db.collection('photo').where(where).orderBy('createTime', 'desc').skip(10 * page).limit(10).get().then(res => {
		console.log(res);
		console.log(event, context);
		return res;
	})
}