const combine = require('koa-combine-routers')

const index = require('./index/index')

const router = combine([index])

module.exports = router
