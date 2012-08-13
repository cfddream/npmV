var crypto = require('crypto');

// MD5
module.exports.md5 = function (str) {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("hex");
};
