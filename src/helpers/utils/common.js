const crypto = require('crypto');
const config = require('../../config');

const encryptIV = async(text, algorithm, secretKey) => {
  const iv = crypto.randomBytes(config.get('/cipher/ivLength'));
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decryptIV = async(text, algorithm, secretKey) => {
  const splitedText = text.split(':');
  const iv = Buffer.from(splitedText.shift(), 'hex');
  const encrypted = Buffer.from(splitedText[0], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  const decrypted = decipher.update(encrypted);
  return Buffer.concat([decrypted, decipher.final()]).toString();
};

module.exports = {
  encryptIV,
  decryptIV
};
