/**
 *
 */
const router = require('koa-router')()
const axios = require('axios')
// const Sequelize = require('sequelize')
// const models = require('../autoScanModels')
// const { } = models
// const {  } = require('../utils')

// const Op = Sequelize.Op

const DINGURL = 'https://oapi.dingtalk.com/robot/send?access_token=0fbb33bd0214cfe747627032d395ceb00fa5355d3ed55fae274122b539c1243a'

/**
 *
 */
router.post('/push', async (ctx) => {
  try {
    const { body: request } = ctx.request
    // if (Object.keys(request).length > 0) {
    //   const res = await axios.post(
    //     DINGURL,
    //     {
    //       msgtype: 'text',
    //       text: {
    //         content: 'test',
    //       },
    //     }
    //   )
    //   console.log('res', res)
    // }
    console.log('request', request)

    ctx.status = 200
    ctx.body = {
      success: true,
    }
  } catch (err) {
    console.log('err', err)
    ctx.status = 500
    ctx.body = {
      success: false,
    }
  }
})

module.exports = router.routes()
