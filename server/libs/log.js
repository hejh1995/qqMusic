const fs = require('fs');
const config = require('../config');

module.exports = server => {
  server.use(async (ctx, next) => {
    // use 函数是所有请求都会经过的。加promise，是为了执行完log记录后next吧
    await new Promise((resolve, reject) => {
      fs.appendFile(config.logPath, `[${Date.now()}---${ctx.method}---${ctx.url}]\r\n`, err => {
        resolve()
      })
    })
    await next();
  })
}
