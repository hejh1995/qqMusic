const crypto = require('crypto');
const _key = 'xcdefvgbhtnytbvdv';

function md5_1(str) {
  const obj = crypto.createHash('md5');
  obj.update(str);
  return obj.digest('hex');
}
module.exports = (str) => {
  return md5_1(md5_1(str) + _key);
}
