const _ = require('lodash')
const axios = require('axios')
const router = require('koa-router')()
const crypto = require('crypto')
const models = require('../autoScanModels')
const { DINGURL, secret, access_token } = require('../config/dingConfig')
const { MembersModel } = models
const { userQuery, userQueryOne } = require('../utils/index')

// 生成签名
const createSign = (timestamp) => {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(timestamp + '\n' + secret)
  const sign = encodeURIComponent(hmac.digest('base64'))
  console.log('-------sign', sign)
  return sign
}

// 查询所有成员
const getMembersList = async () => {
  const res = await userQuery(
    MembersModel,
    {},
    {
      order: [['atCount', 'DESC']],
    }
  )
  const membersList = JSON.parse(JSON.stringify(res))
  console.log('membersList', membersList)
  return membersList
}

// 查询指定成员信息
const getMemberInfo = async (senderNick) => {
  const res = await userQueryOne(MembersModel, {
    name: senderNick,
  })
  const memberInfo = JSON.parse(JSON.stringify(res))
  console.log('memberInfo', memberInfo)
  return memberInfo
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
    const membersList = await getMembersList()
    if (content && content.includes('ok')) {
      // 随机指定一个处理人
      const handleMembers = membersList.filter(
        (item) => item.name !== senderNick.replace(/\s+/g, '')
      )
      const actionMember = _.sample(
        handleMembers.slice(handleMembers.length - 2)
      )
      console.log('actionMember', actionMember)
      // 执行消息推送
      const res = await axios({
        url,
        method: 'post',
        data: {
          msgtype: 'text',
          text: {
            content: `请【${actionMember.name}】去处理【${senderNick}】的合并请求！`,
          },
          at: {
            atMobiles: [actionMember.phone],
            isAtAll: false,
          },
        },
      })
      console.log('res', res)
      // atCount add
      MembersModel.update(
        {
          atCount: actionMember.atCount + 1,
        },
        {
          where: {
            id: actionMember.id,
          },
        }
      )
    } else if (content && content.includes('查询')) {
      // 查询
      const res = await getMemberInfo(senderNick)
      const memberInfo = JSON.parse(JSON.stringify(res))
      await axios({
        url,
        method: 'post',
        data: {
          msgtype: 'text',
          text: {
            content: `共处理合并请求【${memberInfo.atCount}】次`,
          },
          at: {
            atMobiles: [memberInfo.phone],
            isAtAll: false,
          },
        },
      })
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
