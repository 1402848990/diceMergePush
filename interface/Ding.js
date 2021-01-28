const _ = require('lodash')
const axios = require('axios')
const router = require('koa-router')()
const crypto = require('crypto')
const {
  DINGURL,
  members,
  secret,
  access_token,
} = require('../config/dingConfig')

// 生成签名
const createSign = (timestamp) => {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(timestamp + '\n' + secret)
  const sign = encodeURIComponent(hmac.digest('base64'))
  console.log('-------sign', sign)
  return sign
}

/**
 *  @description 【大白】钉钉推送
 */
router.post('/push', async (ctx) => {

  const timestamp = Date.now()
  const url = `${DINGURL}?access_token=${access_token}&timestamp=${timestamp}&sign=${createSign(
    timestamp
  )}`

  try {
    const { body: request } = ctx.request
    const { senderNick, text: { content } = {} } = request
    console.log('request', request)
    if (content && content.includes('ok')) {
      // 随机一个指定人
      const handleMembers = members.filter(
        (item) => item.name !== senderNick.replace(/\s+/g, '')
      )
      const atMobiles = _.sample(handleMembers)
      console.log('atMobiles', atMobiles)
      // 执行消息推送
      const res = await axios({
        url,
        method: 'post',
        data: {
          msgtype: 'text',
          text: {
            content: `请【${atMobiles.name}】去处理【${senderNick}】的合并请求！`,
          },
          at: {
            atMobiles: [atMobiles.phone],
            isAtAll: false,
          },
        },
      })
      // console.log('res', res)
    } else {
      await axios({
        url,
        method: 'post',
        data: {
          msgtype: 'text',
          text: {
            content: '大白不和你玩~',
          },
        },
      })
    }
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
