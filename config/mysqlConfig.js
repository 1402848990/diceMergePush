/**
 * 数据库配置
 */

module.exports = {
  dbname: process.env.MYSQL_DATABASE || 'bigWhite',
  username: process.env.MYSQL_USERNAME ||'root',
  password: process.env.MYSQL_PASSWORD ||'w123456W',
  host:  process.env.MYSQL_HOST || '117.50.94.209',
  port:  process.env.MYSQL_PORT || '3306'
};
