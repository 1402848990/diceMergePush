/**
 *  Model
 */

const db = require('../db')

const MembersModel = db.configureModel('members', {
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
})

module.exports = MembersModel
