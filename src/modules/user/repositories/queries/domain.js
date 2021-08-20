const validate = require('validate.js');
const Query = require('./query');
const Model = require('./query_model');
const config = require('../../../../global_config');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError, BadRequestError } = require('../../../../helpers/error');

const mongodb = new Mongo(config.get('/mongodb').url);
const query = new Query(mongodb);

const getOneUser = async (data) => {
  let userId, result;

  userId = parseInt(data);

  const user = await query.findOneUser({ id: userId });
  if (validate.isEmpty(user.data)) {
    return wrapper.error(new NotFoundError(`can not find user with id ${userId}`, {}));
  }

  result = Model.user();
  result.userId = user.data.id;
  result.name = user.data.name;
  result.gender = user.data.gender;

  return wrapper.data(result);
};

const getUsers = async (data) => {
  let page, size, metadata;

  if (data.page == 0) {
    return wrapper.error(new BadRequestError('page must start from 1', []));
  }

  page = parseInt(data.page) || 1;
  size = parseInt(data.size) || 10;

  const users = await query.findUsers({}, size, page);
  if (validate.isEmpty(users.data)) {
    return wrapper.error(new NotFoundError('can not find user', []));
  }

  const countUsers = await query.countUsers();

  metadata = {
    page,
    size: users.data.length,
    totalPage: Math.ceil(countUsers.data / size),
    totalData: countUsers.data
  };

  return wrapper.paginationData(users.data, metadata);
};

module.exports = {
  getOneUser,
  getUsers
};
