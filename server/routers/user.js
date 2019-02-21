const Router = require('koa-router');
const router = new Router();
const md5 = require('../utils/md5.js')
const uuid = require('uuid/v4');
const fs = require('fs');
const config = require('../config');
const path = require('path');

router.post('register', async ctx => {
  // 查询存在该名称不，不存在该名称，保存数据到数据库，返回注册成功，
  // 存在，返回该名称已存在请重新注册
  const {name, password, avator} = ctx.request.fields
  let user = await ctx.db.execute(`SELECT * FROM user_table WHERE name='${name}'`);
  if (user.length === 0) {
    // 保存图片到服务器，保存图片的地址到数据库。
    // 图片会自动保存，可以获取到文件名，但是用uuid重新命名比较好
    const imgPath = avator[0].path;
    console.log('imgPath', path.extname(imgPath), name, password, avator);
    const avatorName = `${uuid().replace(/\-/g, '')}${path.extname(imgPath)}`
    const newPath = `${config.uploadDir}/${avatorName}`
    const newAvator = `http://localhost:${config.port}/${avatorName}`
    fs.rename(imgPath, newPath, err => {
      console.log('rename-err', err);
    });
    // const newAvator = `/upload/${avatorName}`
    // 密码不能明文保存，需要先加密
    await ctx.db.execute(`INSERT INTO user_table (name, password, avator) VALUES ('${name}', '${md5(password)}', '${newAvator}')`)
    ctx.body = {
      'code': 1,
      'data': `${name}注册成功`,
      'mesg': 'success'
    }
  } else {
    ctx.body = {
      'code': 0,
      'data': `${name} 已经存在`,
      'mesg': 'faild'
    }
  }
});
router.post('login', async ctx => {
  const { name, password } = ctx.request.fields
  let user = await ctx.db.execute(`SELECT * FROM user_table WHERE name="${name}"`);
  if (user.length === 0) {
    ctx.body = {
      'code': 0,
      'data': `${name}不存在`,
      'mesg': 'falid'
    }
  } else if (md5(password) === user[0].password) {
    // 保存登录状态，在获取个人喜欢的音乐等的时候，需要验证是否登录。
    ctx.session.userId = user[0].ID;
    console.log('login', ctx.session.userId);
    ctx.body = {
      'code': 1,
      'data': user[0],
      'mesg': 'success'
    }
  }
});
router.get('logout', async ctx => {
  console.log('logout', ctx.session.userId);
  ctx.session.userId = null;
  ctx.body = {
    'code': 1,
    'mesg': 'success'
  }
});

module.exports = router.routes();
