const validate = require('validate.js');
const Query = require('./query');
const Model = require('./query_model');
const config = require('../../../../global_config');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError } = require('../../../../helpers/error');

const mongodb = new Mongo(config.get('/mongodb').url);
const query = new Query(mongodb);

const getUsers = async () => {
  const user = await query.findUsers({});
  if (validate.isEmpty(user.data)) {
    return wrapper.error(new NotFoundError('can not find user', []));
  }

  return wrapper.data(user.data);
};

const getOneUser = async (data) => {
  let userId, result;

  userId = parseInt(data);

  const user = await query.findOneUser({ id: userId });
  if (validate.isEmpty(user.data)) {
    return wrapper.error(new NotFoundError('can not find user', {}));
  }

  result = Model.user();
  result.userId = user.data.id;
  result.name = user.data.name;
  result.gender = user.data.gender;

  return wrapper.data(result);
};

module.exports = {
  getUsers,
  getOneUser
};
