/*
 * @Author: qiuziz
 * @Date: 2017-05-17 20:12:03
 * @Last Modified by: qiuz
 * @Last Modified time: 2018-10-09 16:25:32
 */

const cheerio = require("cheerio"),
    request = require('./request-promise'),
    async = require("async"),
		download = require('./download.js'),
		connect = require('./db.js'),
		sleep = require('sleep'),
		USER_AGENTS = require('./userAgents'),
    LEN = USER_AGENTS.length - 1,
    schedule = require('node-schedule'),
    scheduleRule = new schedule.RecurrenceRule();

scheduleRule.dayOfWeek = [0, new schedule.Range(1, 6)];
scheduleRule.hour = 2;

scheduleRule.minute = 0;
let timeoutJob = '';

const imagesArray = [], urls = [];

// 产生m 到 n 之间的随机数
function random(m, n) {
	const i = n - m;
	return Math.floor(Math.random() * i + m);
}

const pageUrl = 'https://jandan.net/ooxx';
let currentPage = 1;

function jandan(url) {
  return request(url).then($ => {
    const curPageUrls = $('.current-comment-page')
      , imagesLink = $('.view_img_link');

    currentPage = curPageUrls.eq(0).text().split('[')[1].split(']')[0];

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
          jandan(currentUrl);
        } else {
          if (!timeoutJob) {
            timeoutJob = schedule.scheduleJob(scheduleRule, function(){
              jandan(pageUrl);
            });
          }
        }
    });
  })
  .catch(err => {
    console.log(new Date(),'jandan error:', err);
    jandan(url + '/page-' + (currentPage - 1));
  });
}

jandan(pageUrl);

module.exports = jandan;
