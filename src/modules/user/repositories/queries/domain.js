const validate = require('validate.js');
const Query = require('./query');
const Model = require('./query_model');
const config = require('../../../../config');
const Mysql = require('../../../../helpers/databases/mysql/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError, BadRequestError } = require('../../../../helpers/error');

const mysqldb = new Mysql(config.get('/mysql'));
const query = new Query(mysqldb);

const getOneUser = async (data) => {
  let result, email = data;

  const user = await query.findUserByEmail(email);
  if (user.error || validate.isEmpty(user.data)) {
    return wrapper.error(new NotFoundError(`can not find user with email ${email}`));
  }

  result = Model.user();
  result.name = user.data[0].name;
  result.email = user.data[0].email;
  result.createdAt = user.data[0].created_at;
  result.updatedAt = user.data[0].updated_at;

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
