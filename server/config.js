const pathlib = require('path')
module.exports = {
  port: 3000,
  uploadDir: pathlib.resolve('upload'),
  logPath: pathlib.resolve('log/access.log'),
  secret_key: ['asdcdcfvdfcsdv', 'cdscsaddasdsad'],
  db_host: 'localhost',
  db_port: 3306,
  db_user: 'root',
  db_pass: '',
  db_name: 'music'
}
