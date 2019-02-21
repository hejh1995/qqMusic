const Router = require('koa-router');

const router = new Router();
router.get('', async ctx => {
  console.log('index')
  ctx.body = 'koasssss'
})
module.exports = router.routes();
