/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-09 15:29:46
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-16 15:04:53
 */

const cloud = require('wx-server-sdk');
const cheerio = require('cheerio');
const got = require('got');

cloud.init();
const pageUrl = 'http://jandan.net/ooxx';
const imagesArray = [];

function dateFormat(date, format) {
	let args = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
		'S': date.getMilliseconds()
	};
	if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); }
	for (let i in args) {
		let n = args[i];
		if (new RegExp('(' + i + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length)); }
	}
	return format;
};


async function jandan(url) {
	console.log(url);
	// 1. 获取数据库引用
	const db = cloud.database();
	const red = await got(url);
	const $ = cheerio.load(red.body);
	const curPageUrls = $('.current-comment-page');
	const currentPage = curPageUrls.eq(0).text().split('[')[1].split(']')[0];
	await db.collection('url_page').where({_id: '1e7c918c-998d-43d7-8cc0-1b58da048c24'}).update({data: {currentPage: parseInt(currentPage)}});

	const imagesLink = $('.view_img_link');
	imagesLink.attr('href', function (index, value) {
		value && imagesArray.push(`https:${value}`);
	});
	let len = imagesArray.length;
	for (let i = 0; i < len; i++) {
		const img = imagesArray[i];
		const res = await db.collection('photo').where({ src: img }).count();
		console.log(res);
		if (res && res.total > 0) {
			console.log(`${img}已存在`);
		} else {
			await db.collection('photo').add({
				data: {
					src: img, createTime: dateFormat(new Date(new Date().getTime() + 28800 * 1000), "yyyy-MM-dd hh:mm:ss")
				}
			});
		}
	}
}


exports.main = async (event, context) => {
	const db = cloud.database();
	const res = await db.collection('url_page').get();
	const { data = [] } = res;
	const currentPage = data[0] ? data[0].currentPage : 0;
	await jandan(currentPage > 1 ? `${pageUrl}/page-${currentPage - 1}` : pageUrl);
}