const _ = require('lodash')
const axios = require('axios')
const router = require('koa-router')()
const crypto = require('crypto')

// 钉钉地址
const DINGURL = 'https://oapi.dingtalk.com/robot/send'
// 成员
const members = [
  {
    name: '王锐',
    phone: 15964539289,
  },
  {
    name: '陈子钺',
    phone: 15669765561,
  },
  {
    name: '陈杨子',
    phone: 13588818893,
  },
]
// 秘钥
const secret =
  'SECd6403b2130df7b5d040880d83a207cb97bb41183393f3e90ab1130d3db744e2f'
// access_token
const access_token =
  '3761daeaf05a65ddf9f471037a8db232db7aa55994bed050d464b7f87775e33c'

// 生成签名
const createSign = (timestamp) => {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(timestamp + '\n' + secret)
  const sign = encodeURIComponent(hmac.digest('base64'))
  console.log('-------sign', sign)
  return sign
}

/**
 * 
 */
router.post('/push', async (ctx) => {
  // 随机一个指定人
  const atMobiles = [_.sample(members).phone]
  const timestamp = Date.now()
  console.log('timestamp', timestamp)
  const url = `${DINGURL}?access_token=${access_token}&timestamp=${timestamp}&sign=${createSign(
    timestamp
  )}`

  try {
    const { body: request } = ctx.request
    console.log('request', request)
    if (Object.keys(request).length > 0) {
      const res = await axios({
        url,
        method: 'post',
        data: {
          msgtype: 'text',
          text: {
            content: 'test',
          },
          at: {
            atMobiles,
            isAtAll: false,
          },
        },
      })
      // console.log('res', res)
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
