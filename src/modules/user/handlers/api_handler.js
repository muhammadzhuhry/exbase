const express = require('express');
const commandsDomain = require('../repositories/commands/domain');
const queriesDomain = require('../repositories/queries/domain');
const validator = require('../utils/validator');
const wrapper = require('../../../helpers/utils/wrapper');
const { SUCCESS:http } = require('../../../helpers/http-status/status-code');

const router = express.Router();

// QUERIES

// handler get one user
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  const getOneUser = async () => queriesDomain.getOneUser(userId);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.response(res, 'success', result, `success get user with id ${userId}`, http.OK);
  };
  sendResponse(await getOneUser());
});

// handler get list user
router.get('/', async (req, res) => {
  const payload = { ...req.query };

  const getUsers = async () => queriesDomain.getUsers(payload);
  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success get list user', http.OK);
  };
  sendResponse(await getUsers());
});

// COMMANDS

// hander insert user
router.post('/', async (req, res) => {
  const payload = { ...req.body };

  const validatePayload = await validator.validateInsertUser(payload);
  const postUser = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.insertUser(payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, 'success insert user', http.CREATED);
  };
  sendResponse(await postUser(validatePayload));
});

// hander update user
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const payload = { ...req.body };
  const schema = {
    ...req.params,
    ...req.body
  };

  const validatePayload = await validator.validateUpdateUser(schema);
  const putUser = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.updateUser(userId, payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, `success update user with id ${userId}`, http.OK);
  };
  sendResponse(await putUser(validatePayload));
});

module.exports = router;
