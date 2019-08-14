/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-09 15:29:46
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-14 16:24:50
 */

const cloud = require('wx-server-sdk');
const phantom = require('phantom');
const cheerio = require('cheerio');
const sleep = require('system-sleep');

cloud.init();
const pageUrl = 'http://jandan.net/ooxx';
const imagesArray = [];

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

function jandan(url, db, page, ph) {
	page.open(url).then(function (status) {
		if (status !== 'success') {
			console.log(status);
			return;
		}
		page.property('content').then(function (content) {
			const $ = cheerio.load(content);
			const curPageUrls = $('.current-comment-page');
			currentPage = curPageUrls.eq(0).text().split('[')[1].split(']')[0];

			const imagesLink = $('.view_img_link');
			imagesLink.attr('href', function (index, value) {
				value && imagesArray.push(`https:${value}`);
			});
			console.log(currentPage);
			imagesArray.forEach(async img => {
				const res = await db.collection('photo').where({ src: img }).count();
				console.log(res);
				if (res && res.total && res.total > 0) {
					console.log(`${img}已存在`);
				} else {
					await db.collection('photo').add({
						data: {
							src: img, createTime: new Date().format("yyyy-MM-dd hh:mm:ss")
						}
					});
				}
			});
			if (currentPage - 1 > 0) {
				sleep(200000);
				const currentUrl = pageUrl + '/page-' + (currentPage - 1);
				jandan(currentUrl, db, page, ph);
				return;
			}
			page.close();
			ph.exit();
		})
	})
}

exports.main = async (event, context) => {
	// 1. 获取数据库引用
	const db = cloud.database();
	phantom.create().then(function (ph) {
		ph.createPage().then(function (page) {
			jandan(pageUrl, db, page, ph);
		})
			.catch(error => {
				console.log(error);
				page.close();
			});
	})
		.catch(error => {
			console.log(error);
			ph.exit();
		});
}