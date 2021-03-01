/**
 *  Model
 */

const db = require('../db')
const SERVER_ENV = process.env.SERVER_ENV

const MembersModel = db.configureModel(
  SERVER_ENV ? 'members_test' : 'members',
  {
    name: db.STRING,
    phone: db.BIGINT,
    atCount: {
      type: db.INTEGER,
      allowNull: true,
    },
    status: {
      type: db.INTEGER,
      allowNull: true,
    },
    level: {
      // 1:管理员权限 other:普通权限
      type: db.INTEGER,
      allowNull: true,
    },
  }
)

module.exports = MembersModel
