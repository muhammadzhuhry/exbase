const dateFormat = require('dateformat');
const validate = require('validate.js');
const Command = require('./command');
const Query = require('../queries/query');
const Model = require('./command_model');
const config = require('../../../../config');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError, NotFoundError } = require('../../../../helpers/error');

const mongodb = new Mongo(config.get('/mongodb').url);
const command = new Command(mongodb);
const query = new Query(mongodb);

const insertUser = async (data) => {
  let payload = { ...data };

  let user = Model.user();
  user.id = payload.id;
  user.name = payload.name;
  user.gender = payload.gender;
  user.createdAt = dateFormat(new Date(), 'isoDateTime');
  user.updatedAt = dateFormat(new Date(), 'isoDateTime');

  const insert = await command.insertUser(user);
  if (insert.error) {
    return wrapper.error(new InternalServerError('failed insert user', {}));
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
