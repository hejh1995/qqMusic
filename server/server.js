const Koa = require('koa');
const staticCache = require('koa-static-cache');
const betterBody = require('koa-better-body');
const convert = require('koa-convert');
const session = require('koa-session');
const Router = require('koa-router');
const cors = require('koa2-cors');
const path = require('path');

const config = require('./config');
const error = require('./libs/error_handler');
const loglib = require('./libs/log');
let db = require('./libs/db');

let server = new Koa();
server.listen(config.port);
console.log(`app srart at port ${config.port}`)
// 将body 转为新语法得到版本,不能放在太后面
server.use(convert(betterBody({
  uploadDir: config.uploadDir,
  keepExtensions: 'true'
})));

// session,这个设置也要放在前面
server.keys = ['zxcfgvhj', 'sdtfyguhi'];
server.use(session({
  // httpOnly: true, // 设置为 true 更安全，表示只有服务器可以获取cookie
  maxAge: 1000 * 600 // Cookie 的过期时间
}, server));

// 错误处理
error(server);
// 日志记录
loglib(server);
// 跨域
// server.use(cors({
//   origin: (ctx) => {
//     if (ctx.header.origin && ctx.header.origin.startsWith('http://localhost')) {
//       return '*'
//     }
//     return 'http://localhost:3000'
//   },
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }));
server.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    await next();
  }
)
// 静态文件
server.use(staticCache({
  dynamic: true,
  dir: config.uploadDir}));

server.use(async (ctx, next) => {
  // nodejs没有全局变量，这样使得db可以在任何地方使用
  ctx.db = db;
  await next();
})

const mainRouter = new Router();
mainRouter.use('/', require('./routers/index'));
mainRouter.use('/user/', require('./routers/user'));
server.use(mainRouter.routes());
