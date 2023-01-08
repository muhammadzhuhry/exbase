const jwt = require('jsonwebtoken');
const config = require('../config');
const wrapper = require('../helpers/utils/wrapper');
const { UnauthorizedError, ForbiddenError } = require('../helpers/error');

const secretKey = config.get('/jwt/secretKey');
const signOption = config.get('/jwt/signOptions');
const refreshSecretKey = config.get('/jwt/refresh/secretKey');
const refreshSignOption = config.get('/jwt/refresh/signOptions');

const generateToken = async(payload) => {
  const token = jwt.sign(payload, secretKey, signOption);
  return token;
};

const generateRefreshToken = async(payload) => {
  const token = jwt.sign(payload, refreshSecretKey, refreshSignOption);
  return token;
};

const getToken = (headers) => {
  if (headers.authorization && headers.authorization.includes('Bearer')) {
    const splited = headers.authorization.split(' ');
    if (splited.length === 2) {
      return splited[1];
    }
  }
  return undefined;
};

const verifyToken = async(req, res, next) => {
  const result = {
    error: null,
    data: null
  };

  const token = getToken(req.headers);
  if (!token) {
    result.error = new ForbiddenError('invalid token!');
    return wrapper.response(res, 'fail', result, result.error.message, result.error.code);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secretKey, signOption);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      result.error = new UnauthorizedError('access token expired!');
      return wrapper.response(res, 'fail', result, result.error.message, result.error.code);
    }
    result.error = new UnauthorizedError('token is not valid!');
    return wrapper.response(res, 'fail', result, result.error.message, result.error.code);
  }

  req.userData = decodedToken;
  next();
};

const verifyRefreshToken = async(token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, refreshSecretKey, signOption);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return wrapper.error(new UnauthorizedError('refresh token expired!'));
    }
    return wrapper.error(new UnauthorizedError('refresh token is not valid!'));
  }

  delete decodedToken.iat;
  delete decodedToken.exp;

  return wrapper.data(decodedToken);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};
