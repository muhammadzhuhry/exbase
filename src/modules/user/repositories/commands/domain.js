const dateFormat = require('dateformat');
const Command = require('./command');
const Model = require('./command_model');
const config = require('../../../../global_config');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError } = require('../../../../helpers/error');

const mongodb = new Mongo(config.get('/mongodb').url);
const command = new Command(mongodb);

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
    return wrapper.error(new InternalServerError('failed insert user'));
  }

  return wrapper.data(user);
};

module.exports = {
  insertUser
};
