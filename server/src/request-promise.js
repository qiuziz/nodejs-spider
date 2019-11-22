/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2018-09-21 18:08:15
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-10-30 17:25:49
 */

const rp = require("request-promise"),
  cheerio = require("cheerio");

function request(url, options = {}) {
  return rp({
      uri: 'http://106.54.223.176:9001',
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/json",
      },
      body: JSON.stringify({url}),
      transform: function (body) {
        return cheerio.load(body || '<div></div>');
      },
      ...options
    });
}

module.exports = request;
