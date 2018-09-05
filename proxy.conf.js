const PROXY_CONFIG = [
  {
      context: [
          "/jandan/"
      ],
      target: "http://127.0.0.1:8080",
      secure: false
  }
]
module.exports = PROXY_CONFIG;
