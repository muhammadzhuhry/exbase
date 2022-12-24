const validate = require('validate.js');
const Query = require('./query');
const Model = require('./query_model');
const config = require('../../../../config');
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
  result.id = user.data.id;
  result.name = user.data.name;
  result.gender = user.data.gender;
  result.createdAt = user.data.createdAt;
  result.updatedAt = user.data.updatedAt;

  return wrapper.data(result);
};

const getUsers = async (data) => {
  let page, size, result = [], metadata;

  if (data.page == 0) {
    return wrapper.error(new BadRequestError('page must start from 1', []));
  }

  page = parseInt(data.page) || 1;
  size = parseInt(data.size) || 10;

  const users = await query.findUsers({}, size, page);
  if (validate.isEmpty(users.data)) {
    return wrapper.error(new NotFoundError('can not find user', []));
  }

  users.data.map(data => {
    const user = Model.user();
    user.id = data.id;
    user.name = data.name;
    user.gender = data.gender;
    user.createdAt = data.createdAt;
    user.updatedAt = data.updatedAt;

    result.push(user);
  });

  const countUsers = await query.countUsers();

  metadata = {
    page,
    size: result.length,
    totalPage: Math.ceil(countUsers.data / size),
    totalData: countUsers.data
  };

  return wrapper.paginationData(result, metadata);
};

module.exports = {
  getOneUser,
  getUsers
};
