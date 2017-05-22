/*
 * @Author: qiuziz
 * @Date: 2017-05-17 20:12:03
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-19 11:12:05
 */

var http = require('http'),
		superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
		download = require('./download.js'),
		connect = require('./db.js');
		

// var ep = new eventproxy();
var pageUrl = 'http://jandan.net/ooxx';
var imagesArray = [];
var urls = [];
var currentPage = '';

function jandan(url) {
	 
	superagent.get(url)
					.end(function(err,pres){
					// pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
					// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
					// 剩下就都是利用$ 使用 jquery 的语法了
					var $ = cheerio.load(pres.text);
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
							},500)
						}, function(error, result) {
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
									jandan(pageUrl + '/page-' + (currentPage - 1));
								}
						});
				});

}

// jandan(pageUrl);

module.exports = jandan;