const dateFormat = require('dateformat');
const validate = require('validate.js');
const Command = require('./command');
const Query = require('../queries/query');
const Model = require('./command_model');
const config = require('../../../../config');
const logger = require('../../../../helpers/utils/logger');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError, NotFoundError, BadRequestError } = require('../../../../helpers/error');

const mysqldb = new Mysql(config.get('/mysql'));
const command = new Command(mysqldb);
const query = new Query(mysqldb);

const insertUser = async (data) => {
  const ctx = 'domain-insertUser';
  let payload = { ...data };

  let user = Model.user();
  user.name = payload.name;
  user.email = payload.email;
  user.created_at = dateFormat(new Date(), 'isoDateTime');
  user.updated_at = dateFormat(new Date(), 'isoDateTime');

  const insert = await command.insertUser(user);
  if (insert.error) {
    logger.error(ctx, insert.error, 'error');
    return wrapper.error(new BadRequestError('failed insert user', {}));
  }

  return wrapper.data(user);
};

const updateUser = async (id, data) => {
  let payload = { ...data };
  const userId = parseInt(id);

  const user = await query.findOneUser({ id: userId });
  if (validate.isEmpty(user.data)) {
    return wrapper.error(new NotFoundError(`can not find user with id ${userId}`, {}));
  }

  payload.updatedAt = dateFormat(new Date(), 'isoDateTime');
  const update = await command.updateUser({ id: userId }, payload);
  if (update.error) {
    return wrapper.error(new InternalServerError(`failed update user with id ${userId}`, {}));
  }

  return wrapper.data(update.data);
};

module.exports = {
  insertUser,
  updateUser
};
