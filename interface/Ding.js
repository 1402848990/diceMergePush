/**
 *
 */
const router = require('koa-router')()
// const Sequelize = require('sequelize')
// const models = require('../autoScanModels')
// const { } = models
// const {  } = require('../utils')

// const Op = Sequelize.Op

/**
 *
 */
router.post('/push', async (ctx) => {
  try {
    const { body: request } = ctx.request
    console.log('request',request)
    ctx.status = 200
    ctx.body = {
      success: true,
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

module.exports = router.routes()
