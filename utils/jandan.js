/*
 * @Author: qiuziz
 * @Date: 2017-05-17 20:12:03
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-12-08 12:40:13
 */

var http = require('http'),
		superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
		download = require('./download.js'),
		connect = require('./db.js'),
		sleep = require('sleep'),
		phantom = require('phantom'),
		USER_AGENTS = require('./userAgents'),
		LEN = USER_AGENTS.length - 1;

// var ep = new eventproxy();
var imagesArray = [];
var urls = [];
var currentPage = '';

// 产生m 到 n 之间的随机数
function random(m, n) {
	var i = n - m;
	return Math.floor(Math.random() * i + m);
}

function jandan(url) {
	sleep.sleep(1);
	console.log(url)
	phantom.create().then(function(ph) {
		
		ph.createPage().then(function(page) {
			// page.property('cookies', [{'__cfduid': 'd921e7c03d3a4d5e7f3d2e6c02cfbd9b21508117344'}, {_gat_gtag_UA_462921_3: '1'}, {_ga: 'GA1.2.426864425.1508117359'}, {_gid: 'GA1.2.1190099368.1512628749'}])
			// page.property('userAgent', USER_AGENTS[random(0, LEN)]);
			// page.settings.loadImages = false;
			// page.settings.resourceTimeout = 100000;
			page.open(url).then(function(status) {
				if (status !== 'success') {
					console.log(status);
					return;
				}
				page.property('content').then(function(content) {
					var $ = cheerio.load(content);
					var curPageUrls = $('.current-comment-page');
					currentPage = curPageUrls.eq(0).text().split('[')[1].split(']')[0];
					
					var imagesLink = $('.view_img_link');
					urls = imagesLink;
					
					imagesLink.attr('href',function(index, value){
						imagesArray.push(value.split('//')[1]);
					});
					async.mapSeries(imagesArray, function(url, callback) {
							setTimeout(function() {
								download(url, callback);
							},50000)
						}, function(err, result) {
								if (err) return console.log(err);
									// connect((err, db) => {
									// 	//连接到表 jandan
									// 		var collection = db.collection('jandan');
									// 		//插入数据库
									// 		collection.save({_id: 1, images: result }, function(err, result) { 
									// 			if(err)
									// 			{
									// 					console.log('Error:'+ err);
									// 					return;
									// 			}
									// 			db.close();
									// 		})
									// })
								if (currentPage - 1 > 0) {
									jandan(url + '/page-' + (currentPage - 1));
								}
						});
					ph.exit();
					page.close();
				})
			})
		})
	}).catch(err => {console.log(err)})
	// superagent.get(url)
	// 				.end(function(err,pres){
	// 				// pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
	// 				// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
	// 				// 剩下就都是利用$ 使用 jquery 的语法了
	// 				var $ = cheerio.load(pres.text);
	// 				var curPageUrls = $('.current-comment-page');
	// 				currentPage = curPageUrls.eq(0).text().split('[')[1].split(']')[0];
					
	// 				var imagesLink = $('.view_img_link');
	// 				urls = imagesLink;
					
	// 				imagesLink.attr('href',function(index, value){
	// 					imagesArray.push(value.split('//')[1]);
	// 				});
	// 				async.mapSeries(imagesArray, function(url, callback) {
	// 						setTimeout(function() {
	// 							download(url, callback);
	// 						},500)
	// 					}, function(error, result) {
	// 							if (err) return console.log(err);
	// 								// connect((err, db) => {
	// 								// 	//连接到表 jandan
	// 								// 		var collection = db.collection('jandan');
	// 								// 		//插入数据库
	// 								// 		collection.save({_id: 1, images: result }, function(err, result) { 
	// 								// 			if(err)
	// 								// 			{
	// 								// 					console.log('Error:'+ err);
	// 								// 					return;
	// 								// 			}
	// 								// 			db.close();
	// 								// 		})
	// 								// })
	// 							// if (currentPage - 1 > 0) {
	// 							// 	jandan(pageUrl + '/page-' + (currentPage - 1));
	// 							// }
	// 					});
	// 			});

}

// jandan(pageUrl);

module.exports = jandan;
