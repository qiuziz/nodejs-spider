/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-09 15:29:46
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-15 16:53:22
 */

const cloud = require('wx-server-sdk');

cloud.init();

Date.prototype.format = function (format) {
	let args = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
		'S': this.getMilliseconds()
	};
	if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)); }
	for (let i in args) {
		let n = args[i];
		if (new RegExp('(' + i + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)); }
	}
	return format;
};

async function getImgs(db, data = {}) {
	const { page = 0, where = {} } = data;
	return await db.collection('photo')
		.where(where)
		.orderBy('createTime', 'desc')
		.skip(10 * page).limit(10)
		.get()
		.then(res => {
			return res;
		})
		.catch(err => console.log(err));
}

async function getLikeImgs(db, data = {}) {
	const { page = 0, where = {} } = data;
	const wxContext = await cloud.getWXContext();
	return await db.collection('like')
		.where({userId: wxContext.OPENID, ...where})
		.orderBy('createTime', 'asc')
		.skip(10 * page).limit(10)
		.get()
		.then(res => {
			return res;
		})
		.catch(err => console.log(err));
}

async function like(db, data = {}) {
	const { imgUrl = '' } = data;
	if (!imgUrl) return {errmsg: 'img url cant empty'};
	const wxContext = await cloud.getWXContext();
	const res = await db.collection('user').where({_id: wxContext.OPENID}).count();
	if (res && res.total < 1) {
		await db.collection('user').add({data:{_id: wxContext.OPENID}});
	}
	const total = await db.collection('like').where({src: imgUrl}).count();
	if (total && total.total < 1) {
		return await db.collection('like').add({
			data: {
				userId: wxContext.OPENID,
				src: imgUrl,
				createTime: new Date().format("yyyy-MM-dd hh:mm:ss")
			}
		});
	} else {
		return {}
	}
}

async function unlike(db, data = {}) {
	const { imgUrl = '' } = data;
	if (!imgUrl) return {errmsg: 'img url cant empty'};
	const wxContext = await cloud.getWXContext();
	return await db.collection('like').where({userId: wxContext.OPENID, src: imgUrl}).remove();
}

async function deleteImg(db, data = {}) {
	const { page = 0, imgUrl = '' } = data;
	if (!imgUrl) return {errmsg: 'img url cant empty'};
	return await db.collection('photo')
		.where({src: imgUrl})
		.remove()
		.then(res => {
			return res;
		})
		.catch(err => console.log(err));
}

const Resource = {
	getImgs: getImgs,
	getLikeImgs: getLikeImgs,
	like: like,
	unlike: unlike,
	deleteImg: deleteImg
};

exports.main = async (event, context) => {
	const { fun, data } = event;
	const db = cloud.database();
	let res = {};
	if (fun) {
		res = await Resource[fun](db, data);
	}
	return res;
}