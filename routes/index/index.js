const Router = require('@koa/router')
const router = new Router()

router.get('/index', async (ctx) => {
  ctx.body = 'Hello World'
})

module.exports = router
