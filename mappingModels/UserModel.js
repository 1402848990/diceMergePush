/**
 * 表的Model
 */

const db = require('../db');

const UserModel = db.configureModel('users', {
  reallyName: db.STRING, 
  userName: { 
    type: db.STRING,
    allowNull: true
  }, 
});

module.exports = UserModel;
