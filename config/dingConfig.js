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

  module.exports={
    DINGURL,
    members,
    secret,
    access_token
  }