const PROXY_CONFIG = [
  {
      context: [
          "/jandan/"
      ],
      target: "http://localhost:8080",
      secure: false
  }
]
module.exports = PROXY_CONFIG;
