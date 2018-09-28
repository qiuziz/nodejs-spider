/*
 * @Author: qiuziz
 * @Date: 2017-05-17 20:12:03
 * @Last Modified by: qiuz
 * @Last Modified time: 2018-09-28 10:00:20
 */

const cheerio = require("cheerio"),
    request = require('request'),
    async = require("async"),
		download = require('./download.js'),
		connect = require('./db.js'),
		sleep = require('sleep'),
		USER_AGENTS = require('./userAgents'),
    LEN = USER_AGENTS.length - 1,
    schedule = require('node-schedule'),
    scheduleRule = new schedule.RecurrenceRule(),
    process = require('child_process');

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



function killPlantomJs() {
  //直接调用命令
  process.exec('ps -ef|grep phantomjs|grep -v grep|cut -c 9-15|xargs kill -9', (error, stdout, stderr) => {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

function jandan(url) {

  request({
    url: 'http://localhost:8081',
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({url})
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const
        $ = cheerio.load(body)
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
              jandan(currentUrl);
            } else {
              killPlantomJs();
              if (!timeoutJob) {
                timeoutJob = schedule.scheduleJob(scheduleRule, function(){
                  jandan(pageUrl);
                });
              }
            }
        });
    }
  });
}

module.exports = jandan;
