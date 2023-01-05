const dateFormat = require('dateformat');
const Command = require('./command');
const Model = require('./command_model');
const config = require('../../../../config');
const utils = require('../../../../helpers/utils/common');
const logger = require('../../../../helpers/utils/logger');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError, BadRequestError } = require('../../../../helpers/error');

const algorithm = config.get('/cipher/algorithm');
const secretKey = config.get('/cipher/key');

const mysqldb = new Mysql(config.get('/mysql'));
const command = new Command(mysqldb);

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
  let payload = { ...data };

  payload.updated_at = dateFormat(new Date(), 'isoDateTime');
  const update = await command.updateUser(payload);
  if (update.error) {
    return wrapper.error(new InternalServerError(`failed update user with id ${payload.id}`, {}));
  }

  return wrapper.data({ 'changedRows': update.data.changedRows });
};

module.exports = {
  registerUser,
  updateUser
};
