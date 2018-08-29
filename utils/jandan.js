/*
 * @Author: qiuziz
 * @Date: 2017-05-17 20:12:03
 * @Last Modified by: qiuz <https://github.com/qiuziz>
 * @Last Modified time: 2018-08-29 09:38:00
 */

const http = require('http'),
    cheerio = require("cheerio"),
    async = require("async"),
		download = require('./download.js'),
		connect = require('./db.js'),
		sleep = require('sleep'),
		phantom = require('phantom'),
		USER_AGENTS = require('./userAgents'),
    LEN = USER_AGENTS.length - 1,
    schedule = require('node-schedule'),
    scheduleRule = new schedule.RecurrenceRule(),
    process = require('child_process');

scheduleRule.dayOfWeek = [0, new schedule.Range(1, 6)];
let timeoutJob = '';

const imagesArray = [], urls = [];

// 产生m 到 n 之间的随机数
function random(m, n) {
	const i = n - m;
	return Math.floor(Math.random() * i + m);
}

const pageUrl = 'https://jandan.net/ooxx';



function killPlantomJs() {
  //直接调用命令
  process.exec('ps -ef|grep phantomjs|grep -v grep|cut -c 9-15|xargs kill -9', (error, stdout, stderr) => {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

function jandan(url) {

	phantom.create().then(function(ph) {

		ph.createPage().then(function(page) {
			page.property('userAgent', USER_AGENTS[random(0, LEN)]);
      page.property('resourceTimeout', 10000); // 10 seconds
      page.on('onResourceTimeout', function(e) {
        console.log(e.errorCode);   // it'll probably be 408
        console.log(e.errorString); // it'll probably be 'Network timeout on resource'
        console.log(e.url);         // the url whose request timed out
        ph.exit(1);
      });
			page.open(url).then(function(status) {
				if (status !== 'success') {
          page.close();
					ph.exit();
          jandan(url);
					return;
				}
				page.property('content').then(function(content) {
          const
            $ = cheerio.load(content)
            , curPageUrls = $('.current-comment-page')
            , currentPage = curPageUrls.eq(0).text().split('[')[1].split(']')[0]
            , imagesLink = $('.view_img_link');

					imagesLink.attr('href',function(index, value){
						imagesArray.push('https:' + value);
					});
					async.mapSeries(imagesArray, function(url, callback) {
							download(url, callback);
						}, function(err, result) {
								if (err) return console.log(err);
								if (currentPage - 1 > 0) {
								  sleep.sleep(10);
                  const currentUrl = pageUrl + '/page-' + (currentPage - 1);
                  page.close();
                  ph.exit();
                  jandan(currentUrl);
								} else {
                  page.close();
                  ph.exit();
                  killPlantomJs();
                  if (!timeoutJob) {
                    timeoutJob = schedule.scheduleJob(scheduleRule, function(){
                      jandan(pageUrl);
                    });
                  }
								}
						});
					page.close();
					ph.exit();
				})
			})
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

module.exports = jandan;
