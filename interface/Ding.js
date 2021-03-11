const SERVER_ENV = process.env.SERVER_ENV
const _ = require('lodash')
const axios = require('axios')
const router = require('koa-router')()
const crypto = require('crypto')
const models = require('../autoScanModels')
const { DINGURL, secret, access_token } = require(SERVER_ENV
  ? '../config/dingConfig-test'
  : '../config/dingConfig')
const { MembersModel } = models
const { userQuery, userQueryOne } = require('../utils/index')

console.log('process', process.env.SERVER_ENV)

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
  // console.log('membersList', membersList)
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
  // 根据签名、时间戳、access_token生成url
  const url = `${DINGURL}?access_token=${access_token}&timestamp=${timestamp}&sign=${createSign(
    timestamp
  )}`

  try {
    const { body: request } = ctx.request
    let { senderNick, text: { content = '' } = {} } = request
    console.log('request', request)
    const membersList = await getMembersList()
    // 转为小写
    content = content.toLocaleLowerCase()
    if (content && content.includes('ok')) {
      /**
       * 不完全随机指定成员处理合并请求
       * 1.不包括当前用户
       * 2.不包括请假人员
       * 3.根据权限匹配分组
       */
      // 提取权限
      const level = content.split('ok')[1][0]
      console.log('level', level)
      // 筛选符合条件的成员
      const handleMembers = membersList.filter((item) =>
        level
          ? item.name !== senderNick.replace(/\s+/g, '') &&
            item.status &&
            item.level === +level
          : item.name !== senderNick.replace(/\s+/g, '') && item.status
      )
      // 生成目标成员
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
      // console.log('res', res)
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
    } else if (content && content.includes('请假')) {
      const name = content.match(/【(\S*)】/)[1]
      console.log('name', name)
      const res = await MembersModel.update(
        {
          status: 0,
        },
        {
          where: {
            name,
          },
        }
      )
      console.log('res', res)
      if(res[0]){
        await axios({
          url,
          method: 'post',
          data: {
            msgtype: 'text',
            text: {
              content: `【${name}】请假，设定成功`,
            },
          },
        })
      }
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
