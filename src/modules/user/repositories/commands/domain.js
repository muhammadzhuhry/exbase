const validate = require('validate.js');
const dateFormat = require('dateformat');
const Command = require('./command');
const Query = require('../queries/query');
const Model = require('./command_model');
const config = require('../../../../config');
const utils = require('../../../../helpers/utils/common');
const logger = require('../../../../helpers/utils/logger');
const jwtAuth = require('../../../../auth/jwt_auth_helper');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError, NotFoundError, BadRequestError, UnauthorizedError } = require('../../../../helpers/error');

const algorithm = config.get('/cipher/algorithm');
const secretKey = config.get('/cipher/key');

const mysqldb = new Mysql(config.get('/mysql'));
const command = new Command(mysqldb);
const query = new Query(mysqldb);

const registerUser = async (data) => {
  const ctx = 'domain-registerUser';
  let payload = { ...data };

  const encryptedPassword = await utils.encryptIV(payload.password, algorithm, secretKey);
  let user = Model.user();
  user.name = payload.name;
  user.email = payload.email;
  user.password = encryptedPassword;
  user.created_at = dateFormat(new Date(), 'isoDateTime');
  user.updated_at = dateFormat(new Date(), 'isoDateTime');

  const insert = await command.registerUser(user);
  if (insert.error) {
    logger.error(ctx, insert.error, 'error');
    return wrapper.error(new BadRequestError('failed register user', {}));
  }

  return wrapper.data(user);
};

const updateUser = async (data) => {
  const ctx = 'domain-updateUser';
  let payload = { ...data };

  payload.updated_at = dateFormat(new Date(), 'isoDateTime');
  const update = await command.updateUser(payload);
  if (update.error) {
    logger.error(ctx, update.error, 'error');
    return wrapper.error(new InternalServerError(`failed update user with id ${payload.id}`, {}));
  }

  return wrapper.data({ 'changedRows': update.data.changedRows });
};

const loginUser = async (data) => {
  const ctx = 'domain-loginUser';
  let payload = { ...data };

  const user = await query.findUserByEmail(payload.email);
  if (user.error || validate.isEmpty(user.data)) {
    logger.error(ctx, user.error, 'error');
    return wrapper.error(new NotFoundError('user not found'));
  }

  const decryptedPassword = await utils.decryptIV(user.data[0].password, algorithm, secretKey);
  if (decryptedPassword !== payload.password) {
    logger.info(ctx, 'password invalid!', 'error');
    return wrapper.error(new UnauthorizedError('password invalid!'));
  }

  const accessToken = await jwtAuth.generateToken(payload);
  const refreshToken = await jwtAuth.generateRefreshToken(payload);

  return wrapper.data({
    accessToken,
    refreshToken
  });
};

const regenerateToken = async (data) => {
  const ctx = 'domain-regenerateToken';
  let payload = { ...data };

  const checkedRefreshToken = await jwtAuth.verifyRefreshToken(payload.refreshToken);

  if (checkedRefreshToken.error) {
    logger.info(ctx, 'refresh token is not valid!', 'error');
    return wrapper.error(new UnauthorizedError('refresh token is not valid!'));
  }

  const accessToken = await jwtAuth.generateToken(checkedRefreshToken.data);

  return wrapper.data({
    accessToken
  });
};

module.exports = {
  registerUser,
  updateUser,
  loginUser,
  regenerateToken
};
