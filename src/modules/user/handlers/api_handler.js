const commandsDomain = require('../repositories/commands/domain');
const queriesDomain = require('../repositories/queries/domain');
const validator = require('../utils/validator');
const wrapper = require('../../../helpers/utils/wrapper');
const commandModel = require('../repositories/commands/command_model');
const { SUCCESS:http } = require('../../../helpers/http-status/status-code');

const root = async (req, res) => {
  wrapper.response(res, 'success', wrapper.data('api_handler user'), 'root of user');
};

// QUERIES

// handler get list user
const getUsers = async (req, res) => {
  const payload = { ...req.query };

  const getData = async () => queriesDomain.getUsers(payload);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success get list user', http.OK);
  };
  sendResponse(await getData());
};

// handler get one user
const getOneUser = async (req, res) => {
  const userId = req.params.id;

  const getData = async () => queriesDomain.getOneUser(userId);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.response(res, 'success', result, `success get user with id ${userId}`, http.OK);
  };
  sendResponse(await getData());
};

// COMMANDS

// hander insert user
const registerUser = async (req, res) => {
  const payload = { ...req.body };

  const validatePayload = await validator.isValidPayload(payload, commandModel.registerUserSchema);
  const postUser = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.registerUser(payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success register user', http.CREATED);
  };
  sendResponse(await postUser(validatePayload));
};

// hander update user
const updateUser = async (req, res) => {
  const payload = {
    ...req.params,
    ...req.body
  };

  const validatePayload = await validator.isValidPayload(payload, commandModel.updateUserSchema);
  const putUser = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.updateUser(payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, `success update user with id ${req.params.id}`, http.OK);
  };
  sendResponse(await putUser(validatePayload));
};

// hander login user
const loginUser = async (req, res) => {
  const payload = { ...req.body };

  const validatePayload = await validator.isValidPayload(payload, commandModel.loginSchema);
  const postUser = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.loginUser(payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success loggedin', http.OK);
  };
  sendResponse(await postUser(validatePayload));
};

module.exports = {
  root,
  getUsers,
  getOneUser,
  registerUser,
  updateUser,
  loginUser
};
